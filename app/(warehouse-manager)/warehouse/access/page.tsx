"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomFormField from "@/components/customFormField";
import { FormFieldType } from "@/lib/types";
import React, { useState, FormEvent, useEffect } from "react";
import { getAccessLogs, sendRequestAction } from "@/lib/actions/access.actions";
import { RequestType } from "@/types";
import { ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must have 8 or more characters"
  })
})

const WarehouseAccess = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<RequestType | null>(null);
  const [status, setStatus] = useState<string | null>('');
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  useEffect(() => {
    const fetchAndProcessLogs = async () => {
      try {
        const logs = await getAccessLogs();
        // Get the most recent log
        const latestLog = logs.length > 0
          ? logs.reduce((latest: RequestType, current: RequestType) =>
            new Date(current.startDate) > new Date(latest.startDate) ? current : latest
          )
          : null;

        if (latestLog) {
          setStatus(latestLog.status);
          setLogs(latestLog);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong! Please try again later.",
        })
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
      toast({
        title: "Success",
        description: "Request sent successfully"
      })

    } catch (error) {
      toast({
        title: "Error",
        description: error!.toString()
      })
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
            <h1>{logs?.otp}</h1>
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
            <h2 className="text-xl font-bold tracking-tighter">You have no access</h2>
            <p className="text-muted-foreground text-sm">You currently do not have access to the warehouse</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">Generate OTP</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request for OTP</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={onSubmit} className="grid gap-4">
                    <CustomFormField
                      control={form.control}
                      placeholder="Entrance lock"
                      label="Lock"
                      fieldtype={FormFieldType.SELECT}
                      name="door"
                      id="door">
                      <SelectItem value="sxb">
                        Entrance Lock
                      </SelectItem>
                      <SelectItem value="sxc">
                        Exit Lock
                      </SelectItem>
                    </CustomFormField>
                    <CustomFormField
                      control={form.control}
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
                </Form>
              </DialogContent>
            </Dialog>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full gap-1">
      {renderContent()}
    </div>
  );
};

export default WarehouseAccess;