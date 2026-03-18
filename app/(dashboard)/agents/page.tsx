import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchParams } from 'nuqs';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/trpc/server';
import AgentsView, { AgentsViewError, AgentsViewLoading } from '@/modules/agents/ui/views/agents-view'
import AgentsListHeader from '@/modules/agents/ui/components/agents-list-header';
import { loadSearchParams } from '@/modules/agents/params';

interface Props {
    searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
    const filters = await loadSearchParams(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({ ...filters }));

    return (
        <>
            <AgentsListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={
                    <AgentsViewLoading />
                }>
                    <ErrorBoundary fallback={
                        <AgentsViewError />
                    }>
                        <AgentsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    )
}
