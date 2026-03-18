import React from 'react'
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

export default function AgentsSearchFilter() {
    const [filters, setFilters] = useAgentsFilters()

    return (
        <div className='relative'>
            <Input placeholder='Filter by name' value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} className='h-8 bg-white w-[200px] pl-7' />
            <SearchIcon className='size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
        </div>
    )
}
