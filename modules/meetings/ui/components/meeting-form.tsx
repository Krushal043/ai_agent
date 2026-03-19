import { useState } from 'react';
import z from 'zod';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { MeetingGetOne } from '@/modules/meetings/types';
import { meetingsInsertSchema } from '@/modules/meetings/schemas';
import NewAgentDialog from '@/modules/agents/ui/components/new-agent-dialog';
import GeneratedAvatar from '@/components/generated-avatar';
import CommandSelect from '@/components/command-select';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MeetingFormProps {
    onSuccess: (id?: string) => void;
    onCancel: () => void;
    initialValues?: MeetingGetOne;
}

export default function MeetingForm({ onSuccess, onCancel, initialValues }: MeetingFormProps) {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    )

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({
                        id: initialValues.id
                    }));
                }
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? ""
        }
    })

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting?.isPending || updateMeeting?.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting?.mutate({
                id: initialValues?.id as string,
                ...values
            })
        } else {
            createMeeting?.mutate(values);
        }
    }

    return (
        <>
            <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
            <form id='agent-form' onSubmit={form.handleSubmit(onSubmit)}>
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
                                    placeholder='e.g. Meeting with John Doe'
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="agentId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-email">
                                    Agent
                                </FieldLabel>
                                <CommandSelect
                                    options={(agents?.data?.data ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className='flex items-center gap-x-2'>
                                                <GeneratedAvatar
                                                    seed={agent.name}
                                                    variant='botttsNeutral'
                                                    className='border size-6'
                                                />
                                                <span>{agent.name}</span>
                                            </div>
                                        )
                                    }))}
                                    onSelect={field.onChange}
                                    onSearch={setAgentSearch}
                                    placeholder='Select agent'
                                    value={field.value}
                                    isSearchable
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                <FieldDescription>
                                    Not finding what you&apos;re looking for?
                                    <Button variant='link' type='button' onClick={() => setOpenNewAgentDialog(true)}>
                                        Create new agent
                                    </Button>
                                </FieldDescription>
                            </Field>
                        )}
                    />
                    <div className='flex items-center justify-end gap-x-2'>
                        {onCancel && <Button variant='outline' type='button' onClick={onCancel}>Cancel</Button>}
                        <Button type='submit' disabled={isPending}>{isEdit ? "Update" : "Create"}</Button>
                    </div>
                </FieldGroup>
            </form>
        </>
    )
}