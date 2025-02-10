"use client"

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from "@/hooks/use-toast"
import { z } from 'zod'
import CustomFormField from '@/components/customFormField'
import { FormFieldType } from '@/lib/types'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function Page() {
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
                    toast({
                        title: "Verification Email Sent",
                        description: "If an acoount exists with this email, you will receive a password reset link.",
                    })

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
                    <p className='text-muted-foreground'>Enter the email associated with your account and we&apos;ll send an email with instructions to reset your password</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <CustomFormField
                            control={form.control}
                            name="email"
                            label='Email'
                            placeholder='Enter your email'
                            id='email'
                            fieldtype={FormFieldType.EMAIL}
                        />
                        {
                            isLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link
                                </Button>
                            ) : (
                                <Button type="submit">Send Link</Button>
                            )
                        }


                    </form>
                </Form>
                <Link href={'/signin'} className='flex justify-center items-center gap-2 text-muted-foreground'>
                    <ArrowLeft className='w-4 h-4' />
                    <p className=''>Back to Sign In</p>
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
