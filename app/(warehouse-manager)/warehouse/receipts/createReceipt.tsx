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
import { createReceiptAction } from "./actions"
import { toast } from "sonner"
import { ClientType, CommodityTypes, WarehouseType } from "@/types"
import { CustomComboBox } from "@/components/customCombobox"

interface CreateReceiptProps {
    warehouses: WarehouseType[]
    clients: ClientType[]
    commodities: CommodityTypes[],
    grade: string[]
    cropSeason: string[]
}

export default function CreateReceipt({ props }: { props: CreateReceiptProps }) {
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

    const watchedGroup = form.watch("commodityGroup")
    const varieties =
        props.commodities.find((commodity) => commodity.group === watchedGroup)
            ?.variety || [];


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus size={16} />New Receipt</Button>
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
                        <div className="grid grid-cols-2 gap-4 mt-1">
                            <CustomComboBox
                                control={form.control}
                                name="warehouseId"
                                label="Warehouse"
                                placeholder='Enter Warehouse Name'
                                options={
                                    props.warehouses.map((warehouse: WarehouseType) => ({
                                        label: warehouse.id,
                                        subLabel: warehouse.name,
                                        value: warehouse.id
                                    }))
                                } />
                            <CustomComboBox
                                control={form.control}
                                name="holder"
                                label="Holder"
                                placeholder='Enter holder'
                                options={
                                    props.clients.map((holder: ClientType) => ({
                                        label: holder.name,
                                        value: holder.name
                                    }))
                                } />

                            <CustomComboBox
                                control={form.control}
                                name="commodityGroup"
                                label="Commodity Group"
                                placeholder='Enter commodity group'
                                options={
                                    props.commodities.map((commodity: CommodityTypes) => ({
                                        label: commodity.group,
                                        value: commodity.group
                                    }))
                                } />

                            <CustomComboBox
                                control={form.control}
                                name="commodityVariety"
                                label="Commodity Variety"
                                placeholder='Enter commodity variety'
                                options={
                                    varieties.map((variety: string) => ({
                                        label: variety,
                                        value: variety
                                    }))
                                } />

                            <CustomComboBox
                                control={form.control}
                                name="grade"
                                label="Grade"
                                placeholder='Enter grade'
                                options={
                                    props.grade!.map((grade: string) => ({
                                        label: grade,
                                        value: grade
                                    }))
                                } />
                            <CustomFormField control={form.control} name="currency" label="Currency" placeholder="Enter currency" fieldtype={FormFieldType.INPUT} />

                            <CustomComboBox
                                control={form.control}
                                name="cropSeason"
                                label="Crop Season"
                                placeholder='Enter crop season'
                                options={
                                    props.cropSeason.map((season: string) => ({
                                        label: season,
                                        value: season
                                    }))
                                } />
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
                                {form.formState.isSubmitting ? <span className="flex items-center"><Loader2 className="animate-spin mr-2" />Creating</span> : "Create Receipt"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}