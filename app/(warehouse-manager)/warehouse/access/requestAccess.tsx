"use client"

import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { SelectItem } from '@/components/ui/select'
import { sendRequestAction } from '@/lib/actions/access.actions'
import { getUser } from '@/lib/getUser'
import { FormFieldType } from '@/lib/types'
import { requestAccessFormData, requestAccessFormSchema } from '@/lib/validation'
import { DeviceInfo } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const RequestAccess = ({ deviceInfo }: { deviceInfo: DeviceInfo[] }) => {

    const form = useForm<requestAccessFormData>({
        resolver: zodResolver(requestAccessFormSchema),
        defaultValues: {
            deviceId: "",
            reason: ""
        },
    })

    const userId = getUser()?.id

    async function onSubmit(data: requestAccessFormData) {
        const result = await sendRequestAction(data, userId!)
        if (result!.success === false) {
            toast.error("An error occurred while requesting access")
        }

        if (result!.success === false) {
            toast.success("Access request sent successfully")
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-4">Generate OTP</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request for OTP</DialogTitle>
                        <DialogDescription className="text-secondary">This pin will expire once used. Too many attempts will result in the device being blocked for the remainder of the day.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <CustomFormField
                                control={form.control}
                                placeholder="Enter a lock"
                                label="Lock"
                                fieldtype={FormFieldType.SELECT}
                                name="deviceId">
                                {
                                    deviceInfo.map((device: any) => (
                                        <SelectItem key={device.id} value={device.deviceId}>
                                            {device.deviceId}{" - "}{device.deviceName}
                                        </SelectItem>
                                    ))
                                }
                            </CustomFormField>
                            <CustomFormField
                                control={form.control}
                                label="Reason for Access"
                                required
                                fieldtype={FormFieldType.TEXTAREA}
                                name="reason"
                                placeholder="Reason for Access"
                            />
                            <DialogFooter>
                                <Button className="flex items-center" type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <><Loader2 className="animate-spin" /> Requesting</> : 'Request'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
