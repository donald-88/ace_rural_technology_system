"use client"

import Image from 'next/image'
import React from 'react';
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

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
    const { toast } = useToast()
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
            fetchOptions: {
                onRequest: () => {
                    setIsLoading(true)
                },
                onSuccess: () => {
                    router.push("/")

                },
                onError: (ctx) => {
                    setIsLoading(false)
                    if (ctx.error.status === 403) {
                        toast({
                            title: "Email Verification Required",
                            description: "Please verify your email address",
                            variant: "destructive"
                        })
                    }
                    toast({
                        title: "Something went wrong!",
                        description: ctx.error.message,
                        variant: "destructive"
                    })
                }
            }
        })
    }

    return (
        <section className="w-full h-screen lg:grid lg:grid-cols-2">
            <section className="flex items-center justify-center h-full py-12">
                <div className="mx-auto w-full sm:w-[350px]">
                    <div className='relative my-6 w-32 right-0 h-[60px]'>
                        <Image
                            src="/logo.png"
                            alt="logo"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                    <div className="grid mb-4">
                        <h2 className="text-2xl font-bold">Welcome Back!</h2>
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
                                            <Input type='email' placeholder="m@example.com" {...field} />
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
                                            <Input type='password' placeholder="************" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex justify-between'>
                                <div className='flex gap-2 items-center'><Checkbox />
                                    <p>Remember me</p>
                                </div>
                                <Link href="/forgot-password" className='underline text-primary'>
                                    <p>Forgot Password</p>
                                </Link>
                            </div>
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
                </div>
            </section>
            <div className="hidden bg-white lg:block relative">
                <Image
                    src="/hero.png"
                    alt="Heroimage"
                    fill
                    className="object-cover dark:brightness-[0.2] dark:grayscale p-2 rounded-2xl overflow-clip"
                />
            </div>
        </section>
    )
}