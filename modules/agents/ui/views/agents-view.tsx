"use client"

import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query';
import { DataTable } from '../components/data-table';
import { columns } from '../components/columns';
import EmptyState from '@/components/empty-state';

export default function AgentsView() {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
            {data.length === 0 ? <EmptyState title="No Agents" description="Create your first agent to get started" /> : <DataTable columns={columns} data={data} />}
        </div>
    )
}

export function AgentsViewError() {
    return (
        <ErrorState
            title='Failed to load agents'
            description='Please try again later.....'
        />
    )
}

export function AgentsViewLoading() {
    return (
        <LoadingState
            title='Loading Agents'
            description='This may take a few seconds.....'
        />
    )
}