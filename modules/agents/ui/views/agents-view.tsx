"use client"

import { useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query';
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import EmptyState from '@/components/empty-state';
import { DataTable } from '@/components/data-table';
import DataPagination from '@/components/data-pagination';
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters';
import { columns } from '@/modules/agents/ui/components/columns';

export default function AgentsView() {
    const router = useRouter()
    const [filters, setFilters] = useAgentsFilters()
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));

    return (
        <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
            {data?.data.length === 0 ?
                <EmptyState title="No Agents" description="Create your first agent to get started" /> :
                <>
                    <DataTable
                        columns={columns}
                        data={data?.data}
                        onRawClick={(row) => router.push(`/agents/${row.id}`)} />
                    <DataPagination
                        page={filters?.page}
                        totalPages={data?.totalPages}
                        onPageChange={(page) => setFilters({ page })}
                    />
                </>}
        </div>
    )
}

export function AgentsViewError() {
    return (
        <ErrorState
            title='Failed to load agent'
            description='Please try again later.....'
        />
    )
}

export function AgentsViewLoading() {
    return (
        <LoadingState
            title='Loading Agent'
            description='This may take a few seconds.....'
        />
    )
}