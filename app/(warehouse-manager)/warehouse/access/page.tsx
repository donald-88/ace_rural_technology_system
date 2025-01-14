"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomFormField from "@/components/customFormField";
import { FormFieldType } from "@/lib/types";
import React, { useState, FormEvent } from "react";
import { sendRequestAction } from "@/lib/actions/access.actions";
import { RequestType } from "@/types";
import { getSession } from "@/lib/actions/user.action";
import { toast } from "sonner";

const WarehouseAccess = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [device_id, setDeviceId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const reason = formData.get("reason") as string;
      const door = formData.get("door") as string;

      if (door === "Chilimika Front door") {
        setDeviceId("SP2X18346b05")
      }
      else {
        setDeviceId("SP2X188bc606")
      }

      const session = await getSession()

      const requestData = {
        user_id: session.user._id,
        otp: "",
        startDate: new Date(),
        device_id: device_id,
        reason: reason,
        role: session.user.role
      } as RequestType;

      await sendRequestAction(requestData);
      setOpen(false);

      toast.success("Request sent successfully");

    } catch (error) {
      toast.error(error!.toString());
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center text-center h-full gap-4">
      {
        status === 'granted' ? (
          <>
            <p className="text-muted-foreground">Enter the one time pin below to unlock</p>
            <h1>725818</h1>
          </>
        ) : status === 'denied' ? (
          <div>Denied</div>
        ) : (
          <>
            <p className="text-muted-foreground">You currently do not have access to the warehouse.</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button>Request OTP</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request for Access</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <CustomFormField placeholder="Chilimika Front door" label="Door" fieldtype={FormFieldType.SELECT} options={['Chilimika Front door', 'Exit door Lock']} name={"door"} id={"door"}
                  />
                  <CustomFormField
                    label="Reason for Access"
                    required fieldtype={FormFieldType.TEXTAREA} name={"reason"} id={"reason"} />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Sending request...' : 'Submit'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )
      }
    </div>
  );
};

export default WarehouseAccess;
