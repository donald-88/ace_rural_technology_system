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
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    holder: z.string().min(2, {
        message: "Holder is required."
    }),
    commodityVariety: z.string().min(1,{
        message: "Commodity variety is required."
    }),
    commodityGroup: z.string().min(1, {
        message: "Commodity group is required."
    }),
    commodityGrade: z.string().min(1, {
        message: "Commodity grade is required."
    }),
    warehouseId: z.string().min(1, {
        message: "Warehouse is required."
    }),
    currency: z.string().min(1, {
        message: "Currency is required."
    }),
    cropSeason: z.string().min(1, {
        message: "Crop season is required."
    })
})

export default function CreateReceipt() {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            holder: "",
            commodityVariety: "",
            commodityGroup: "",
            commodityGrade: "",
            warehouseId: "",
            currency: "",
            cropSeason: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"}>
                    <UserPlus size={16} className="mr-2" />New Receipt</Button>
            </DialogTrigger>
            <DialogContent className="p-7 px-8 md:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>New Warehouse Receipt</DialogTitle>
                    <DialogDescription>Fill in the form to create a new receipt</DialogDescription>
                </DialogHeader>
                <Separator />
                {/*  */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <CustomFormField control={form.control} name="holder" label="Holder" placeholder="Enter holder" fieldtype={FormFieldType.INPUT} />
                            <CustomFormField control={form.control} name="commodityVariety" label="Commodity Variety" placeholder="Enter commodity variety" fieldtype={FormFieldType.INPUT} />
                            <CustomFormField control={form.control} name="commodityGroup" label="Commodity Group" placeholder="Enter commodity group" fieldtype={FormFieldType.SELECT} />
                            <CustomFormField control={form.control} name="warehouse" label="Warehouse" placeholder="Enter warehouse" fieldtype={FormFieldType.SELECT} />
                            <CustomFormField control={form.control} name="currency" label="Currency" placeholder="Enter currency" fieldtype={FormFieldType.SELECT} />
                            <CustomFormField control={form.control} name="cropSeason" label="Crop Season" placeholder="Enter crops season" fieldtype={FormFieldType.SELECT} />
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
                                Create Receipt
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}