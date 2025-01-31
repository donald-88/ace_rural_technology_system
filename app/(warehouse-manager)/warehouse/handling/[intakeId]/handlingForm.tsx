"use client"

import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { FormFieldType } from '@/lib/types'
import React, { useActionState } from 'react';
import { createHandlingAction } from './action'

const initialState = {}

const HandlingForm = () => {
    const [state, formAction] = useActionState(createHandlingAction, initialState)
  return (
      <form action={formAction} className="grid gap-2 p-4">

          <div className="grid grid-cols-2 gap-2">
              <CustomFormField
                  placeholder=""
                  name="commodity"
                  label="Commodity"
                  id="commodity"
                  fieldtype={FormFieldType.INPUT}
              />
              <CustomFormField
                  placeholder=""
                  name="variety"
                  label="Variety"
                  id="variety"
                  fieldtype={FormFieldType.INPUT}
              />
              <CustomFormField
                  placeholder=""
                  name="grade"
                  label="Grade"
                  id="grade"
                  fieldtype={FormFieldType.NUMBER}
              />
              <CustomFormField
                  placeholder=""
                  name="price"
                  label="Price/Kg"
                  id="price"
                  fieldtype={FormFieldType.NUMBER}
              />
              <CustomFormField
                  placeholder=""
                  name="grossWeight"
                  label="Gross Weight"
                  id="grossWeight"
                  fieldtype={FormFieldType.NUMBER}
              />
              <CustomFormField
                  placeholder=""
                  name="deductions"
                  label="Deductions"
                  id="deductions"
                  fieldtype={FormFieldType.NUMBER}
              />
              <CustomFormField
                  placeholder=""
                  name="netWeight"
                  label="Net Weight"
                  id="netWeight"
                  fieldtype={FormFieldType.NUMBER}
              />
              <CustomFormField
                  placeholder=""
                  name="moistureIn"
                  label="Moisture In"
                  id="moistureIn"
                  fieldtype={FormFieldType.NUMBER}
              />
              <CustomFormField
                  placeholder=""
                  name="noOfBags"
                  label="No of Bags"
                  id="noOfBags"
                  fieldtype={FormFieldType.NUMBER}
              />
              <CustomFormField
                  placeholder=""
                  name="bagsReturned"
                  label="Bags Returned"
                  id="bagsReturned"
                  fieldtype={FormFieldType.NUMBER}
              />
          </div>
          <div className="h-2" />
          <Button type="submit">Submit</Button>
      </form>
  )
}

export default HandlingForm