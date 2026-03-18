"use client";

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';

export default function MeetingsView() {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div>
            {JSON.stringify(data)}
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