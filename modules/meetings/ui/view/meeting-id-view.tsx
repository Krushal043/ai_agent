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
import UpcomingState from '@/modules/meetings/ui/components/upcoming-state';
import ActiveState from '@/modules/meetings/ui/components/active-state';
import CancelledState from '@/modules/meetings/ui/components/cancelled-state';
import ProcessingState from '@/modules/meetings/ui/components/processing-state';

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

    const isActive = data.status === "active"
    const isCompleted = data.status === "completed"
    const isCancelled = data.status === "cancelled"
    const isUpcoming = data.status === "upcoming"
    const isProcessing = data.status === "processing"

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog open={updateMeetingDialogOpen} onOpenChange={setUpdateMeetingDialogOpen} initialValues={data} />
            <div className='flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4'>
                <MeetingIdViewHeader meetingId={meetingId} meetingName={data.name} onEdit={() => setUpdateMeetingDialogOpen(true)} onRemove={handleRemoveMeeting} />
                {isCancelled && <div>
                    <CancelledState />
                </div>}
                {isUpcoming && <div>
                    <UpcomingState
                        meetingId={meetingId}
                        onCancelMeeting={() => { }}
                        isCancelling={false}
                    />
                </div>}
                {isProcessing && <div>
                    <ProcessingState />
                </div>}
                {isActive && <div>
                    <ActiveState meetingId={meetingId} />
                </div>}
                {isCompleted && <div>
                    <p>Meeting Completed</p>
                </div>}
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