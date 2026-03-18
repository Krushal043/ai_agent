import React from 'react'
import { AgentGetOne } from '../../types';
import { useTRPC } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { agentsInsertSchema } from '../../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import GeneratedAvatar from '@/components/generated-avatar';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AgentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialValues?: AgentGetOne;
}

export default function AgentForm({ onSuccess, onCancel, initialValues }: AgentFormProps) {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({
                        id: initialValues.id
                    }));
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? ""
        }
    })

    const isEdit = !!initialValues?.id;
    const isPending = createAgent?.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            console.log("update agent");
        } else {
            createAgent?.mutate(values);
        }
    }

    return (
        <form id='agent-form' onSubmit={form.handleSubmit(onSubmit)}>
            <GeneratedAvatar
                seed={form.watch("name")}
                variant='botttsNeutral'
                className='border size-16'
            />
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-email">
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                placeholder='e.g. Kushal Sojitra'
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="instructions"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-email">
                                Instructions
                            </FieldLabel>
                            <Textarea
                                {...field}
                                placeholder='Write instructions for your agent'
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <div className='flex items-center justify-end gap-x-2'>
                    {onCancel && <Button variant='outline' type='button' onClick={onCancel}>Cancel</Button>}
                    <Button type='submit' disabled={isPending}>{isEdit ? "Update" : "Create"}</Button>
                </div>
            </FieldGroup>
        </form>
    )
}