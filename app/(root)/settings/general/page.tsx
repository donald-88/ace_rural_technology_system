"use client";

import CustomFormField from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { FormFieldType } from "@/lib/types";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must have 8 or more characters"
  })
})

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })



  const [user, setUser] = useState<User | null>(null)
  const roleOptions = ['admin', 'manager']
  const notificationOptions = ['Email', 'SMS', 'Both']

  async function onSubmit(values: z.infer<typeof formSchema>) {
  }

  useEffect(() => {
    const fetchSession = async () => {
      const session = await authClient.getSession()
      setUser(session.data?.user as User)
    }
    fetchSession()
  }, [])

  return (
    <section className='p-4 grid gap-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex justify-between">
            <h2>Profile Settings</h2>
            <div className="grid grid-cols-2 gap-4 w-2/3">
              <CustomFormField
                control={form.control}
                fieldtype={FormFieldType.INPUT}
                placeholder={user?.name}
                name="name"
                label="Name"
                disabled={true}
              />
              <CustomFormField
                control={form.control}
                fieldtype={FormFieldType.EMAIL}
                placeholder={user?.email}
                name="email"
                label="Email"
                disabled={true}
              />

              <CustomFormField
                control={form.control}
                fieldtype={FormFieldType.PHONE_INPUT}
                placeholder={user?.phone}
                name="phone"
                label="Phone"
                disabled={true}
              />

              <CustomFormField
                control={form.control}
                fieldtype={FormFieldType.INPUT}
                placeholder={user?.role}
                name="role"
                label="Role"
                disabled={true}
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <h2>Preferences</h2>
            <div className="grid grid-cols-2 gap-4 w-2/3">
              <CustomFormField
                control={form.control}
                fieldtype={FormFieldType.SELECT}
                placeholder="SMS"
                name="notification"
                label="Notification Preference"
                children={
                  notificationOptions.map((notification) => (
                    <SelectItem key={notification} value={notification}>
                      {notification}
                    </SelectItem>
                  ))
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>


    </section>
  );
}