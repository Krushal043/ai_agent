import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getQueryClient, trpc } from '@/trpc/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import AgentsView, { AgentsViewError, AgentsViewLoading } from '@/modules/agents/ui/views/agents-view'
import AgentsListHeader from '@/modules/agents/ui/components/agents-list-header';

export default function Page() {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

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
