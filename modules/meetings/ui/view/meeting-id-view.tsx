"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { useConfirm } from '@/hooks/use-confirm';
import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'
import UpdateMeetingDialog from '@/modules/meetings/ui/components/update-meeting-dialog';
import MeetingIdViewHeader from '@/modules/meetings/ui/view/meeting-id-view-header';

interface Props {
    meetingId: string
}

export default function MeetingIdView({ meetingId }: Props) {
    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
    const router = useRouter()
    const trpc = useTRPC();
    const queryClient = useQueryClient()
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Remove Meeting",
        "Are you sure you want to remove this meeting?",
    )

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
                router.push("/meetings")
            },
            onError: (error) => {
                console.log(error)
            }
        })
    )

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove()

        if (!ok) return

        await removeMeeting.mutateAsync({ id: meetingId })
    }

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog open={updateMeetingDialogOpen} onOpenChange={setUpdateMeetingDialogOpen} initialValues={data} />
            <div className='flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4'>
                <MeetingIdViewHeader meetingId={meetingId} meetingName={data.name} onEdit={() => setUpdateMeetingDialogOpen(true)} onRemove={handleRemoveMeeting} />
                {JSON.stringify(data, null, 2)}
            </div>
        </>
    )
}

export function MeetingIdViewError() {
    return (
        <ErrorState
            title='Failed to load meeting'
            description='Please try again later.....'
        />
    )
}

export function MeetingIdViewLoading() {
    return (
        <LoadingState
            title='Loading Meeting'
            description='This may take a few seconds.....'
        />
    )
}