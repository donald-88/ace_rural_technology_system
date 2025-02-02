"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from "@/hooks/use-toast"
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function Page() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        await authClient.forgetPassword({
            email: values.email,
            redirectTo: "/reset-password",
            fetchOptions: {
                onSuccess: () => {
                    setIsLoading(false)
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
            <div className='mx-auto flex flex-col justify-center gap-4 w-full h-full sm:w-[350px]'>
                <div>
                    <h2 className='font-bold text-2xl'>Forgot Password?</h2>
                    <p className='text-muted-foreground'>No problem, we&apos;ll send you reset instructions</p>
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
                        {
                            isLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in
                                </Button>
                            ) : (
                                <Button type="submit">Reset Password</Button>
                            )
                        }


                    </form>
                </Form>
                <Link href={'/signin'} className='flex justify-center items-center gap-2'>
                    <ArrowLeft className='w-4 h-4' />
                    <p>Back to Sign In</p>
                </Link>
            </div>
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
