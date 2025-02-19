import { UserPlus } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Separator } from "./ui/separator"
import CustomFormField from "./customFormField"
import { FormFieldType } from "@/lib/types"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { receiptFormSchema, type receiptFormData } from "@/lib/validation"
import { createReceipt } from "@/lib/actions/receipt.actions"
import { SelectItem } from "./ui/select"

export default function CreateReceipt() {
    const { toast } = useToast()
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

    async function onSubmit(values: receiptFormData) {
        try {
            await createReceipt({
                holder: values.holder,
                commodityVariety: values.commodityVariety,
                commodityGroup: values.commodityGroup,
                grade: values.grade,
                warehouse_id: values.warehouseId,
                currency: values.currency,
                cropSeason: values.cropSeason,
            })

            toast({
                title: "Receipt created",
                description: "Your receipt has been created."
            })
        } catch (error) {
            console.log(error)
            toast({
                title: "Failed to Create Receipt",
                description: "An error occurred while creating your receipt.",
                variant: "destructive"
            })
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