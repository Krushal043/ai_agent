import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getQueryClient, trpc } from '@/trpc/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import MeetingIdView, { MeetingIdViewError, MeetingIdViewLoading } from '@/modules/meetings/ui/view/meeting-id-view';

interface Props {
    params: Promise<{ meetingId: string }>
}

export default async function Page({ params }: Props) {
    const { meetingId } = await params

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return redirect("/sign-in");
    }

    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<MeetingIdViewLoading />}>
                    <ErrorBoundary fallback={<MeetingIdViewError />}>
                        <MeetingIdView meetingId={meetingId} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    )
}
