"use client"

import Image from 'next/image'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CustomFormField from '@/components/customFormField';
import { FormFieldType } from '@/lib/types';
import { useFormState } from "react-dom";
import { signUpFormAction } from "./actions";

const initialState = {
    message: "",
};

const Signup = () => {

    const [state, formAction] = useFormState(signUpFormAction, initialState);

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
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[380px] gap-6">
                    <div className='w-full flex justify-center'>
                        <Image src={"/logo.png"} alt="logo" width={240} height={200} />
                    </div>
                    <div className="grid text-center">
                        <h1 className="text-xl text-secondary font-bold">Create Account</h1>
                        <p className="text-balance text-sm text-secondary">
                            Sign up with your credentials to get started
                        </p>
                    </div>
                    <form action={formAction} className="grid gap-4">
                        <CustomFormField placeholder='m@example.com' name='email' label='Email' id='email' fieldType={FormFieldType.INPUT} />
                        <CustomFormField placeholder='************' name='password' label='Password' id='password' fieldType={FormFieldType.PASSWORD} />
                        <CustomFormField placeholder='************' name='confirmPassword' label='Confirm Password' id='confirmPassword' fieldType={FormFieldType.PASSWORD} />
                        <Button
                            type="submit"
                            className="w-full bg-primary"
                        >
                            Sign Up
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-secondary">
                        Already have an account?{" "}
                        <Link href="/signin" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Signup