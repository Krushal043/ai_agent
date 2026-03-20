"use client"

import { useState } from 'react'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import { DEFAULT_PAGE } from '@/constanst'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import NewMeetingDialog from '@/modules/meetings/ui/components/new-meeting-dialog'
import MeetingsSearchFilter from '@/modules/meetings/ui/components/meetings-search-filter'
import StatusFilter from '@/modules/meetings/ui/components/status-filter'
import AgentIdFilter from '@/modules/meetings/ui/components/agent-id-filter'
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters'

export default function MeetingsListHeader() {
    const [filters, setFilters] = useMeetingsFilters()
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified = !!filters.agentId || !!filters.status || !!filters.search

    const onClearFilters = () => {
        setFilters({
            status: null,
            agentId: "",
            search: "",
            page: DEFAULT_PAGE
        })
    }

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
                <ScrollArea>
                    <div className='flex items-center gap-x-2 p-1'>
                        <MeetingsSearchFilter />
                        <StatusFilter />
                        <AgentIdFilter />
                        {isAnyFilterModified && (
                            <Button variant="outline" onClick={onClearFilters}>
                                <XCircleIcon className='size-4' />
                                Clear
                            </Button>
                        )}
                    </div>
                    <ScrollBar orientation='horizontal' />
                </ScrollArea>
            </div>
        </>
    )
}