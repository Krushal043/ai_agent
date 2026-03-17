"use client";

import { Command, CommandDialog, CommandEmpty, CommandInput, CommandList } from '@/components/ui/command';
import { Dispatch, SetStateAction } from 'react'

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardCommand({ open, setOpen }: Props) {
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {/* <CommandItem>Test</CommandItem> */}
                </CommandList>
            </Command>
        </CommandDialog>
    )
}
