import { UserPlus } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Separator } from "./ui/separator"
import CustomFormField from "./customFormField"
import { FormFieldType } from "@/lib/types"
import { Form } from "@/components/ui/form"
import { roleOptions } from "@/constants"
import { SelectItem } from "./ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
    email: z.string().email({
        message: "Please enter a valid email address."
    }),
    role: z.string().min(1, {
        message: "Please select a role."
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
    })
})

export default function CreateMember() {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            password: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await authClient.admin.createUser({
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
            fetchOptions: {
                onSuccess: () => {
                    authClient.sendVerificationEmail({
                        email: values.email,
                        callbackURL: "/email-verified",
                        fetchOptions: {
                            onSuccess: () => {
                                toast({
                                    title: "Verification email sent",
                                    description: "A verification email has been sent to the user's email address.",
                                    variant: "default"
                                })
                            },
                            onError: () => {
                                toast({
                                    title: "Verification email failed",
                                    description: "An error occurred while sending the verification email.",
                                    variant: "destructive"
                                })
                            }
                        }
                    })
                }
            }
        });
    }
    

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"}>
                    <UserPlus size={16} className="mr-2" />Add Member</Button>
            </DialogTrigger>
            <DialogContent className="p-7 px-8 md:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Add Memeber</DialogTitle>
                    <DialogDescription>Fill in the form to add a new member</DialogDescription>
                </DialogHeader>
                <Separator />
                {/*  */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col gap-2 mt-1">
                            <div className="grid grid-cols-2 gap-4">
                                <CustomFormField control={form.control} fieldtype={FormFieldType.INPUT} name={"name"} id={"name"} placeholder="John Doe" label="Name" />
                                <CustomFormField control={form.control} fieldtype={FormFieldType.EMAIL} name={"email"} id={"email"} placeholder="m@example.com" label="Email" />
                            </div>

                            <div className="grid grid-cols-2 gap-5 items-start mt-4">
                                <CustomFormField control={form.control} fieldtype={FormFieldType.SELECT} id="name" name="role" placeholder="ex. Admin" label="Role" children={
                                    roleOptions.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))
                                } />
                                <CustomFormField control={form.control} fieldtype={FormFieldType.PASSWORD} name={"password"} id={"password"} placeholder="********" label="Initial Password" />
                            </div>
                        </div>
                        <DialogFooter className="mt-9 mb-4 flex items-center ">
                            <DialogClose
                                asChild
                            >
                                <Button variant={"outline"}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button type="submit">
                                Add Member
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}