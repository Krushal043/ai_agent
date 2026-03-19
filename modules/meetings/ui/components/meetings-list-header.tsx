"use client"

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import NewMeetingDialog from '@/modules/meetings/ui/components/new-meeting-dialog'
import { Button } from '@/components/ui/button'

export default function MeetingsListHeader() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
            <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
                <div className='flex items-center justify-between'>
                    <h5 className='text-xl font-medium'>My Meetings</h5>
                    <Button size="lg" onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon />
                        New Meeting
                    </Button>
                </div>
                <div className='flex items-center gap-x-2 p-1'>

                </div>
            </div>
        </>
    )
}