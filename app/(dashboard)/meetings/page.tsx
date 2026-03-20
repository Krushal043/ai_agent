import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { auth } from '@/lib/auth';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/trpc/server';
import MeetingsView, { MeetingsViewError, MeetingsViewLoading } from '@/modules/meetings/ui/view/meetings-view'
import MeetingsListHeader from '@/modules/meetings/ui/components/meetings-list-header';
import { loadSearchParams } from '@/modules/meetings/params';

interface Props {
    searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
    const filters = await loadSearchParams(searchParams)

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
        ...filters
    }));

    return (
        <>
            <MeetingsListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<MeetingsViewLoading />}>
                    <ErrorBoundary fallback={<MeetingsViewError />}>
                        <MeetingsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    )
}
