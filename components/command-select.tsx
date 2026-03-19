import React, { ReactNode, useState } from 'react'
import { ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from '@/components/ui/command';

interface Props {
    options: Array<{
        id: string,
        value: string,
        children: ReactNode
    }>;
    onSelect: (value: string) => void;
    onSearch: (value: string) => void;
    placeholder?: string;
    value?: string;
    isSearchable?: boolean;
    className?: string;
}

export default function CommandSelect({ options, onSelect, onSearch, placeholder, value, isSearchable, className }: Props) {
    const [open, setOpen] = useState(false)
    const selectOption = options?.find((option) => option.value === value)

    return (
        <>
            <Button type='button' variant='outline' className={cn("h-9 justify-between font-normal px-2", !selectOption && "text-muted-foreground", className)} onClick={() => setOpen(true)}>
                <div>
                    {selectOption?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>
            <CommandResponsiveDialog open={open} onOpenChange={setOpen} >
                <Command shouldFilter={!onSearch}>
                    <CommandInput placeholder="Search..." onValueChange={onSearch} />
                    <CommandList>
                        <CommandEmpty>
                            <span className='text-muted-foreground text-sm'>
                                No results found.
                            </span>
                        </CommandEmpty>
                        {options?.map((option) => (
                            <CommandItem
                                key={option.id}
                                onSelect={() => {
                                    onSelect(option.value)
                                    setOpen(false)
                                }}
                                value={option.value}>
                                {option.children}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </CommandResponsiveDialog>
        </>
    )
}