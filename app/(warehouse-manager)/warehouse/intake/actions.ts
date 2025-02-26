"use server";

import { createDeposit, generateINKId } from "@/lib/actions/intake.actions";
import { depositFormData, depositFormSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { WarehouseReceipt } from "@/db/schema/warehouse-receipt";

export async function createIntakeAction(
  formData: depositFormData, // Form data
  allReceipts: WarehouseReceipt[], // List of warehouse receipts
  depositors: any[] // List of depositors
) {
  try {
      // Validate the form data using Zod
      const validatedData = depositFormSchema.safeParse(formData);
      if (!validatedData.success) {
          return {
              status: "error",
              message: validatedData.error.message,
          };
      }

      // Generate a unique ID for the deposit
      const id = await generateINKId();

      // Fetch depositor details from the depositors list
      const depositorDetails = depositors.find((depositor) => depositor.name === validatedData.data.depositorId);

      if (!depositorDetails) {
          return {
              status: "error",
              message: "Depositor not found.",
          };
      }

      // Fetch warehouse receipt details from the allReceipts list
      const warehouseReceiptDetails = allReceipts.find((receipt) => receipt.id === validatedData.data.warehouseReceiptNumber);

      if (!warehouseReceiptDetails) {
          return {
              status: "error",
              message: "Warehouse receipt not found.",
          };
      }

      // Create the deposit in the database
      const result = await createDeposit({
          id: id,
          warehouseReceiptId: validatedData.data.warehouseReceiptNumber,
          depositorId: validatedData.data.depositorId,
          costProfile: validatedData.data.costProfile,
          incomingBags: validatedData.data.incomingBags.toString(),
          moisture: validatedData.data.moisture.toString(),
          deductions: validatedData.data.deductions.toString(),
          netWeight: validatedData.data.netWeight.toString(),
          weightEntries: validatedData.data.bagEntries.map((entry) => ({
              bagsWeighed: entry.numberOfBags.toString(),
              grossWeight: entry.grossWeight.toString(),
          })),
      });

      // Calculate total gross weight from weightEntries
      const totalGrossWeight = validatedData.data.bagEntries.reduce(
          (sum, entry) => sum + Number(entry.grossWeight),
          0
      );

      // Prepare the payload for printing
      const printPayload = {
          formData: validatedData.data, // Include all validated form data
          depositorDetails: {
              id: depositorDetails.name, // Use the depositor's name as the ID
              name: depositorDetails.name,
              phone: depositorDetails.phone,
          },
          warehouseReceiptDetails: {
              id: warehouseReceiptDetails.id,
              warehouse_id: warehouseReceiptDetails.warehouse_id,
              holder: warehouseReceiptDetails.holder,
              commodityGroup: warehouseReceiptDetails.commodityGroup,
              commodityVariety: warehouseReceiptDetails.commodityVariety,
              grade: warehouseReceiptDetails.grade,
              currency: warehouseReceiptDetails.currency,
              cropSeason: warehouseReceiptDetails.cropSeason,
          },
          grossWeight: totalGrossWeight,
          netWeight: validatedData.data.netWeight,
      };

      // Send data to the printing API
      const printResponse = await fetch("http://192.168.137.150:5000/print", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(printPayload),
      });

      // Check if the printing API request was successful
      if (!printResponse.ok) {
          throw new Error("Failed to print details");
      }

      // Return success response
      return {
          status: "success",
          message: "Deposit created successfully.",
      };
  } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
          return {
              status: "error",
              message: error.message,
          };
      }

      // Handle general errors
      console.error("Error creating deposit:", error);
      return {
          status: "error",
          message: "An error occurred while creating the deposit.",
      };
  }
}