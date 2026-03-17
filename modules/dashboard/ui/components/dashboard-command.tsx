"use client";

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from '@/components/ui/command';
import { Dispatch, SetStateAction } from 'react'

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardCommand({ open, setOpen }: Props) {
    return (
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandItem>Test</CommandItem>
                    <CommandItem>Test 1</CommandItem>
                    <CommandItem>Test 2</CommandItem>
                </CommandList>
            </Command>
        </CommandResponsiveDialog>
    )
}
