import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client'
import CommandSelect from '@/components/command-select';
import GeneratedAvatar from '@/components/generated-avatar';
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters'

export default function AgentIdFilter() {
    const [filters, setFilters] = useMeetingsFilters()

    const trpc = useTRPC();
    const [agentSearch, setAgentSearch] = useState("")

    const { data } = useQuery(
        trpc.agents.getMany.queryOptions({
            search: agentSearch,
            pageSize: 100,
        })
    )

    return (
        <CommandSelect
            className='h-9'
            placeholder='Agent'
            options={(data?.data ?? []).map(agent => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className='flex items-center gap-x-2'>
                        <GeneratedAvatar
                            seed={agent.name}
                            variant='botttsNeutral'
                            className='size-4'
                        />
                        {agent.name}
                    </div>
                )
            }))}
            onSearch={setAgentSearch}
            onSelect={(value) => setFilters({ agentId: value })}
            value={filters.agentId ?? ""}
        />
    )
}