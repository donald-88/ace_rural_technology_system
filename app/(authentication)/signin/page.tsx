"use client"

import Image from 'next/image'
import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CustomFormField from '@/components/customFormField';
import { FormFieldType } from '@/lib/types';
import { signInFormAction } from './actions';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

const initialState = {
    message: "",
};

const Signin = () => {

    const [state, formAction] = useFormState(signInFormAction, initialState);

    if (state.message === "Sign in failed!") {
        toast.error(state.message)
    }

    return (
        <section className="w-full h-screen lg:grid lg:grid-cols-2">
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <section className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[380px] gap-6">
                    <div className='w-full flex justify-center'>
                        <Image src={"/logo.png"} alt="logo" width={240} height={200} />
                    </div>
                    <div className="grid text-center">
                        <h1 className="text-xl text-secondary font-bold">Sign In</h1>
                        <p className="text-balance text-sm text-secondary">
                            Sign in with your credentials to continue
                        </p>
                    </div>

                    <form action={formAction} className="grid gap-4">
                        <CustomFormField placeholder='m@example.com' name='email' label='Email' id='email' fieldType={FormFieldType.INPUT} />
                        <CustomFormField placeholder='************' name='password' label='Password' id='password' fieldType={FormFieldType.PASSWORD} />
                        <Button type="submit" className="w-full bg-primary">
                            Sign In
                        </Button>
                    </form>

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

export default Signin