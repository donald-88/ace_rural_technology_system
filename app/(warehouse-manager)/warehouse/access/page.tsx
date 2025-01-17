"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomFormField from "@/components/customFormField";
import { FormFieldType } from "@/lib/types";
import React, { useState, FormEvent, useEffect } from "react";
import { getAccessLogs, sendRequestAction } from "@/lib/actions/access.actions";
import { RequestType } from "@/types";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

const WarehouseAccess = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>('');

  useEffect(() => {
    const fetchAndProcessLogs = async () => {
      try {
        const logs = await getAccessLogs();
        // Get the most recent log
        const latestLog = logs.length > 0
          ? logs.reduce((latest: { startDate: string | number | Date; }, current: { startDate: string | number | Date; }) =>
            new Date(current.startDate) > new Date(latest.startDate) ? current : latest
          )
          : null;

        if (latestLog) {
          setStatus(latestLog.status);
          setLogs(latestLog);
        }
      } catch (error) {
        toast.error("Failed to fetch access logs");
        console.error(error);
      }
    };

    fetchAndProcessLogs();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const reason = formData.get("reason") as string;
      const door = formData.get("door") as string;

      const newDeviceId = door === "Chilimika Front door"
        ? "SP2X18346b05"
        : "SP2X188bc606";

      const requestData = {
        otp: "",
        startDate: new Date(),
        device_id: newDeviceId,
        reason: reason,
        status: "pending"
      } as RequestType;

      await sendRequestAction(requestData);
      setStatus("pending");
      setOpen(false);
      toast.success("Request sent successfully");

    } catch (error) {
      toast.error(error!.toString());
    } finally {
      setIsLoading(false);
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'granted':
        return (
          <>
            <p className="text-muted-foreground">Enter the one time pin below to unlock</p>
            <h1>{logs!.otp}</h1>
          </>
        );
      case 'denied':
        return (
          <div className="text-red-500 flex flex-col justify-center items-center gap-2">
            <ShieldAlert size={32} />
            <p>Your access request was denied. You can submit a new request if needed.</p>
          </div>
        );
      case 'pending':
        return (
          <div className="text-yellow-500 flex flex-col justify-center items-center gap-2">
            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-yellow-500 animate-spin"></div>
            <p>Your access request is pending approval.</p>
          </div>
        );
      default:
        return (
          <>
            <p className="text-muted-foreground">You currently do not have access to the warehouse.</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Request OTP</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request for Access</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <CustomFormField
                    placeholder="Chilimika Front door"
                    label="Door"
                    fieldtype={FormFieldType.SELECT}
                    options={['Chilimika Front door', 'Exit door Lock']}
                    name="door"
                    id="door"
                  />
                  <CustomFormField
                    label="Reason for Access"
                    required
                    fieldtype={FormFieldType.TEXTAREA}
                    name="reason"
                    id="reason"
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Sending request...' : 'Submit'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full gap-2">
      {renderContent()}
    </div>
  );
};

export default WarehouseAccess;