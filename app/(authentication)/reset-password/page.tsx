"use client"

import CustomFormField from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { FormFieldType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    newPassword: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    confirmPassword: z.string().min(2, {
        message: "Passwords do not match",
    })
})

export default function Page() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        await authClient.resetPassword({
            newPassword: values.newPassword,
            fetchOptions: {
                onSuccess: () => {
                    setIsLoading(false)
                    toast({
                        title: "Success",
                        description: "Password reset successful. Login to continue."
                    });
                    router.push("/signin")

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
                        title: "Something went wrong",
                        description: ctx.error.message,
                        variant: "destructive"
                    })
                }
            }
        })
    }

    if (error === 'invalid_token') {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Image src="/logo.png" alt="logo" width={160} height={160} />
                <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
                <p className="text-muted-foreground">The password reset link is invalid or has expired.</p>
            </div>
        )

    }

    return (
        <section className="w-full h-screen lg:grid lg:grid-cols-2">
            <div className='mx-auto flex flex-col justify-center gap-4 w-full h-full sm:w-[350px]'>
                <div>
                    <h2 className='font-bold text-2xl'>Change Password</h2>
                    <p className='text-muted-foreground'>Almost done. Enter your new password and you&apos;re all set.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <CustomFormField
                            control={form.control}
                            name="newPassword"
                            label='New Password'
                            placeholder='Enter your new password'
                            id='newPassword'
                            fieldtype={FormFieldType.PASSWORD}
                        />
                        <CustomFormField
                            control={form.control}
                            name="confirmPassword"
                            label='Confirm Password'
                            placeholder='Confirm your new password'
                            id='confirmPassword'
                            fieldtype={FormFieldType.PASSWORD}
                        />
                        {
                            isLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reseting
                                </Button>
                            ) : (
                                <Button type="submit">Reset Password</Button>
                            )
                        }


                    </form>
                </Form>
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