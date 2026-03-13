"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, useForm } from 'react-hook-form';

import { FaGithub, FaGoogle } from 'react-icons/fa';

import { OctagonAlertIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Alert, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export default function SignUpView() {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, serError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        serError(null);
        setPending(true);
        try {
            authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    setPending(false);
                    router.push("/")
                },
                onError: (error) => {
                    serError(error.error.message);
                    setPending(false);
                }
            })
        } catch (error) {
            serError("Something went wrong:" + error);
        }
    }

    const onSocial = (provider: "github" | "google") => {
        serError(null);
        setPending(true);
        try {
            authClient.signIn.social({
                provider: provider,
                callbackURL: "/"
            }, {
                onSuccess: () => {
                    setPending(false);
                },
                onError: ({ error }) => {
                    serError(error.message);
                    setPending(false);
                }
            })
        } catch (error) {
            serError("Something went wrong:" + error);
        }
    }

    return (
        <div className='flex flex-col gap-6'>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <div className='p-6 md:p-8 flex flex-col gap-6'>
                        <form id='sign-in-form' onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col items-center text-center'>
                                    <h1 className='text-2xl font-bold'>Let&apos;s get you started</h1>
                                    <p className='text-muted-foreground text-balance'>Create an account</p>
                                </div>
                                <div className='gird gap-3'>
                                    <FieldGroup>
                                        <Controller
                                            name="name"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="form-rhf-demo-name">
                                                        Name
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-rhf-demo-name"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="AI Agent"
                                                        type='text'
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="email"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="form-rhf-demo-email">
                                                        Email
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-rhf-demo-email"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="ai@example.com"
                                                        autoComplete="off"
                                                        type='email'
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="password"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="form-rhf-demo-password">
                                                        Password
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-rhf-demo-password"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="••••••"
                                                        autoComplete="off"
                                                        type='password'
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="confirmPassword"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="form-rhf-demo-confirm-password">
                                                        Confirm Password
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-rhf-demo-confirm-password"
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="••••••"
                                                        autoComplete="off"
                                                        type='password'
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>
                                </div>
                            </div>
                        </form>
                        {!!error && <Alert className='bg-destructive/10 border-none'>
                            <OctagonAlertIcon className='h-4 w-4 text-destructive!' />
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>}
                        <Button type='submit' disabled={pending} form='sign-in-form' className='w-full'>
                            Sign in
                        </Button>
                        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                            <span className='bg-card text-muted-foreground relative z-10 px-2'>
                                Or continue with
                            </span>
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <Button
                                variant="outline"
                                type='button'
                                disabled={pending}
                                className='w-full'
                                onClick={() => onSocial("google")}>
                                <FaGoogle />
                            </Button>
                            <Button
                                variant="outline"
                                type='button'
                                disabled={pending}
                                className='w-full'
                                onClick={() => onSocial("github")}>
                                <FaGithub />
                            </Button>
                        </div>
                        <div className='text-center text-sm'>
                            Already have an account? <Link href="/sign-in" className='text-primary underline underline-offset-4'>Sign in</Link>
                        </div>
                    </div>
                    <div className='bg-radial form-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center'>
                        <Image src="/logo.svg" alt='logo' className='h-[92px] w-[92px]' height={92} width={92} />
                        <p className='text-2xl font-semibold text-foreground'>AI Agent</p>
                    </div>
                </CardContent>
            </Card>
            <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
                By signing in, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
            </div>
        </div>
    )
}
