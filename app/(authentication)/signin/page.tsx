"use client"

import Image from 'next/image'
import React from 'react';
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must have 8 or more characters"
    })
})

export default function Page() {

    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        const { email, password } = values;
        await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
            fetchOptions: {
                onSuccess: () => {
                    setIsLoading(false)
                    router.push("/")

                },
                onError: (ctx) => {
                    setIsLoading(false)
                    if (ctx.error.status === 403) {
                        toast.error("Please verify your email address")
                    }
                    toast.error(ctx.error.message)
                }
            }
        })
    }

    return (
        <section className="w-full h-screen lg:grid lg:grid-cols-2">
            <div className="hidden bg-muted lg:block relative">
                <Image
                    src="/hero.png"
                    alt="Heroimage"
                    fill
                    className="object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <section className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[380px] gap-6">
                    <div className='w-full flex justify-center relative h-[60px]'>
                        <Image
                            src="/logo.png"
                            alt="logo"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                    <div className="grid text-center">
                        <h1 className="text-xl text-secondary font-bold">Sign In</h1>
                        <p className="text-balance text-sm text-secondary">
                            Sign in with your credentials to continue
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="************" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {
                                isLoading ? (
                                    <Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in
                                    </Button>
                                ) : (
                                    <Button type="submit">Sign In</Button>
                                )
                            }
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm text-secondary">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    )
}