import React from 'react'
import { authClient } from '@/lib/auth-client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import GeneratedAvatar from '@/components/generated-avatar';
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function DashboardUserButton() {
    const router = useRouter();
    const { data, isPending } = authClient.useSession();

    const onLogOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/auth/login')
                }
            }
        })
    }

    if (isPending || !data?.user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden'>
                {data?.user?.image ? <Avatar>
                    <AvatarImage src={data.user.image} />
                </Avatar> : <GeneratedAvatar seed={data?.user?.name} variant='initials' className='size-9 mr-3' />}
                <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                    <p className='truncate w-full text-sm font-medium'>{data?.user?.name}</p>
                    <p className='truncate w-full text-xs text-muted-foreground'>{data?.user?.email}</p>
                </div>
                <ChevronDownIcon className='size-4 shrink-0' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' side='top' className='w-72'>
                <DropdownMenuLabel>
                    <div className='flex flex-col gap-1'>
                        <span className='text-sm font-medium truncate'>{data?.user?.name}</span>
                        <span className='text-xs text-muted-foreground truncate'>{data?.user?.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer flex items-center justify-between'>
                    Billing
                    <CreditCardIcon className='size-4' />
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer flex items-center justify-between' onClick={onLogOut}>
                    Logout
                    <LogOutIcon className='size-4' />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
