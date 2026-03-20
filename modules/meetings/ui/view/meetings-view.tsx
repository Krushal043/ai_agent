"use client";

import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { DataTable } from '@/components/data-table';
import EmptyState from '@/components/empty-state';
import DataPagination from '@/components/data-pagination';
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';
import { columns } from '@/modules/meetings/ui/components/columns';

export default function MeetingsView() {
    const [filters, setFilters] = useMeetingsFilters()
    const router = useRouter()
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }));

    return (
        <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
            {data?.data.length === 0 ? (
                <EmptyState
                    title='Create your first meeting'
                    description='Schedule a meeting to connect with others. Each meetings lets you collaborate, share ideas, and interact with participants in real time.'
                />
            ) : (
                <>
                    <DataTable data={data?.data} columns={columns} onRawClick={(row) => router.push(`/meetings/${row.id}`)} />
                    <DataPagination totalPages={data?.totalPages} page={filters?.page} onPageChange={(page) => setFilters({ page })} />
                </>
            )}
        </div>
    )
}

export function MeetingsViewError() {
    return (
        <ErrorState
            title='Failed to load meetings'
            description='Please try again later.....'
        />
    )
}

export function MeetingsViewLoading() {
    return (
        <LoadingState
            title='Loading Meetings'
            description='This may take a few seconds.....'
        />
    )
}