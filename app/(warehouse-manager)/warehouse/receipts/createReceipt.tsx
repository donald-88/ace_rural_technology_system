import { Loader2, UserPlus } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { Separator } from "../../../../components/ui/separator"
import CustomFormField from "../../../../components/customFormField"
import { FormFieldType } from "@/lib/types"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { receiptFormSchema, type receiptFormData } from "@/lib/validation"
import { SelectItem } from "../../../../components/ui/select"
import { createReceiptAction } from "./actions"
import { toast } from "sonner"

export default function CreateReceipt() {
    const form = useForm<receiptFormData>({
        resolver: zodResolver(receiptFormSchema),
        defaultValues: {
            warehouseId: "",
            holder: "",
            commodityVariety: "",
            commodityGroup: "",
            grade: "",
            currency: "",
            cropSeason: ""
        }
    })

    const warehouses = [
        {
            id: "WH001SA",
            name: "Chilimika",
            location: "Salima",
        },
        {
            id: "WH001LL",
            name: "Kalemba",
            location: "Lilongwe",
        }
    ]

    const resetForm = () => {
        form.reset()
    }

    async function onSubmit(values: receiptFormData) {
        const result = await createReceiptAction(values)
        if (result.status === "error") {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            resetForm()
        }
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
                            <CustomFormField control={form.control} name="warehouseId" label="WarehouseId" placeholder="Enter warehouse" fieldtype={FormFieldType.SELECT} children={
                                warehouses.map((warehouse) => (
                                    <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
                                ))
                            } />
                            <CustomFormField control={form.control} name="holder" label="Holder" placeholder="Enter holder" fieldtype={FormFieldType.INPUT} />
                            <CustomFormField control={form.control} name="commodityVariety" label="Commodity Variety" placeholder="Enter commodity variety" fieldtype={FormFieldType.INPUT} />
                            <CustomFormField control={form.control} name="commodityGroup" label="Commodity Group" placeholder="Enter commodity group" fieldtype={FormFieldType.INPUT} />
                            <CustomFormField control={form.control} name="grade" label="Commodity Grade" placeholder="Enter commodity grade" fieldtype={FormFieldType.INPUT} />
                            <CustomFormField control={form.control} name="currency" label="Currency" placeholder="Enter currency" fieldtype={FormFieldType.INPUT} />
                            <CustomFormField control={form.control} name="cropSeason" label="Crop Season" placeholder="Enter crops season" fieldtype={FormFieldType.INPUT} />
                        </div>
                        <DialogFooter className="mt-9 mb-4 flex items-center">
                            <DialogClose
                                asChild
                            >
                                <Button variant={"outline"}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <span className="flex items-center"><Loader2 className="mr-2"/>Creating</span> : "Create Receipt"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}