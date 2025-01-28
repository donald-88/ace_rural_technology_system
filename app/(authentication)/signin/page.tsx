"use client"

import Image from 'next/image'
import React, { useActionState } from 'react'
import Link from 'next/link'
import CustomFormField from '@/components/customFormField'
import { FormFieldType } from '@/lib/types'
import { signInFormAction } from './actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'


export default function Page() {
    const [error, formAction, isPending] = useActionState(signInFormAction, null);

    error && toast.error('Failed to sign in')

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
                    <form action={formAction} className="grid gap-4">
                        <CustomFormField
                            placeholder='m@example.com'
                            name='email'
                            label='Email'
                            id='email'
                            fieldtype={FormFieldType.INPUT}
                        />
                        <CustomFormField
                            placeholder='************'
                            name='password'
                            label='Password'
                            id='password'
                            fieldtype={FormFieldType.PASSWORD}
                        />
                        {
                            isPending ? (
                                <Button disabled>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Please wait
                                </Button>
                            ): (
                                <Button type='submit'>
                                    Sign In
                                </Button>
                            )
                        }
                    </form>
                </div>
            </section>
        </section>
    )
}