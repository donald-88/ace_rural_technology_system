"use client";

import CustomFormField from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { roleOptions } from "@/constants";
import { FormFieldType } from "@/lib/types";

const General = () => {

  return (
    <section className='p-4 grid gap-6'>
      <div className="flex justify-between">
        <h2>Profile Settings</h2>
        <div className="grid grid-cols-2 gap-4 w-1/2">
          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            placeholder="Sophie Banda"
            name="name"
            label="Name"
            id="name"
          />
          <CustomFormField
            fieldtype={FormFieldType.EMAIL}
            placeholder="sophiebanda@gmail.com"
            name="email"
            label="Email"
            id="email"
          />

          <CustomFormField
            fieldtype={FormFieldType.INPUT}
            placeholder="+260977777777"
            name="phone"
            label="Phone"
            id="phone"
          />

          <CustomFormField
            fieldtype={FormFieldType.SELECT}
            placeholder="Admin"
            name="role"
            label="Role"
            id="role"
            options={roleOptions}
          />
        </div>
      </div>
      <Separator/>

      <div className="flex justify-between">
        <h2>Preferences</h2>
        <div className="grid grid-cols-2 gap-4 w-1/2">
          <CustomFormField
          fieldtype={FormFieldType.SELECT}
          placeholder="SMS"
          name="notification"
          label="Notification Preference"
          id="notification"
          options={["SMS", "EMAIL"]}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant={"outline"}>
          Save Changes
        </Button>
      </div>
    </section>
  );
};

export default General;
