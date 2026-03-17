import { Loader2Icon } from 'lucide-react';
import React from 'react'

interface Props {
    title: string;
    description?: string;
}

export default function LoadingState({ title, description }: Props) {
    return (
        <div className='py-4 px-8 flex flex-1 items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm'>
                <Loader2Icon className='animate-spin size-6 text-primary' />
                <div className='flex flex-col text-center gap-y-2'>
                    <h6 className='font-semibold text-lg'>{title}</h6>
                    <p className='text-muted-foreground text-sm'>{description}</p>
                </div>
            </div>
        </div>
    )
}