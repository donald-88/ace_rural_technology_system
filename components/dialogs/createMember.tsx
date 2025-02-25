import { UserPlus } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Separator } from "../ui/separator"
import CustomFormField from "../customFormField"
import { FormFieldType } from "@/lib/types"
import { Form } from "@/components/ui/form"
import { roleOptions } from "@/constants"
import { SelectItem } from "../ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"
import { teamMemberformSchema, type teamMemberformData } from "@/lib/validation"

export default function CreateMember() {
    const { toast } = useToast()
    const form = useForm<teamMemberformData>({
        resolver: zodResolver(teamMemberformSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            password: ""
        }
    })

    async function onSubmit(values: teamMemberformData) {
        console.log("Member working")
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
                                <CustomFormField control={form.control} fieldtype={FormFieldType.INPUT} name={"name"} placeholder="John Doe" label="Name" defaultValue={0} />
                                <CustomFormField control={form.control} fieldtype={FormFieldType.EMAIL} name={"email"} placeholder="m@example.com" label="Email" defaultValue={0} />
                            </div>

                            <div className="grid grid-cols-2 gap-5 items-start mt-4">
                                <CustomFormField control={form.control} fieldtype={FormFieldType.SELECT} name="role" placeholder="ex. Admin" label="Role" children={roleOptions.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))} defaultValue={0} />
                                <CustomFormField control={form.control} fieldtype={FormFieldType.PASSWORD} name={"password"} placeholder="********" label="Initial Password" defaultValue={0} />
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