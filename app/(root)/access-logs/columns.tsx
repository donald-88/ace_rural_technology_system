"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export type Access = {
  id: string;
  name: string;
  otp: string;
  reason: string;
  role: string;
  date: string;
  timeOfEntry: string;
  timeOfExit: string;
};

export const columns: ColumnDef<Access>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "otp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          OTP
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
  },

  {
    accessorKey: "device_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Device ID
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
  },

  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Date
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("datetime") as string;
      const formatted = new Date(date).toLocaleDateString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "datetime",
    header: "Time of Entry",
    cell: ({ row }) => {
      const date = row.getValue("datetime") as string;
      const formatted = new Date(date).toLocaleTimeString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "time_of_exit",
    header: "Time of Exit",
    cell: ({ row }) => {
      const date = row.getValue("time_of_exit") as string;
      const formatted = new Date(date).toLocaleTimeString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const intake = row.original;

      const [loading, setLoading] = useState(false);

      const handleDatabaseSubmission = async (
        pin: string,
        pinId: string,
        name: string
      ) => {
        try {
          const dbApiUrl = "https://api.yourdatabase.com/pins"; // Replace with your actual database API endpoint
          const response = await fetch(dbApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_DB_API_TOKEN}`, // Replace with your actual database token
            },
            body: JSON.stringify({
              pin,
              pinId,
              name,
              accessTime: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Database API responded with status ${response.status}`
            );
          }

          const result = await response.json();
          console.log("Data successfully sent to database:", result);
          alert("Data successfully stored in the database.");
        } catch (error) {
          console.error("Error sending data to database:", error);
          alert("Failed to send data to the database.");
        }
      };

      const handleAccept = async () => {
        setLoading(true);

        const requestData = {
          variance: 1,
          startDate: "2025-01-21T00:00:00+08:00",
          accessName: intake.name,
        };

        const token =
          "eyJraWQiOiJMNGhScm1BbzEya2lVa3BvVlM1Tkg0KytGWUhXb0FmZU0zXC90RTViMkRmUT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNzhqZTU5Z2ZscDVtaThpdmplZnRnbHJlZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiaWdsb29ob21lYXBpXC9hbGdvcGluLW9uZXRpbWUiLCJhdXRoX3RpbWUiOjE3MzQ1MjQzMzgsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzc1MHR6dzdlVSIsImV4cCI6MTczNDYxMDczOCwiaWF0IjoxNzM0NTI0MzM4LCJ2ZXJzaW9uIjoyLCJqdGkiOiIzNWI4NDU3Yy00NjdiLTQ1ZDEtODk4MC1kMjVlY2NjYmIwMjEiLCJjbGllbnRfaWQiOiIxNzhqZTU5Z2ZscDVtaThpdmplZnRnbHJlZiJ9.dTTCb9UsWx1mlFEUjD9M2LHr7AbKqfRm0IFLI1abaAfTjJUZ45Ua2877sqUJb2e_ndLZ16lXnLsbK4I1iPgNZiSlBRyo8pJ7RfiYmdrZfarMeAHPhgYLjO63VXdBCzharMawEs4CbKFmJMGsRtKp6cLlsU1cdwCVy_qRG-oqaUz4Tl3TFB-hZPchDRrwPfN2G_0_cc3ZUldG0zSl57PLx4jlfzcAfOaS0nEA2T7gXePi_mxECiVTRX7tmaTL22bvFEJxlFQwGdCMzRSfoP_z_k_3Y8_-0-wlonlcCVR0GHldbluC2xSd1yFp271mPkNDlbJkUaNW3qmbZSBysYdB7w"; // Replace with your Igloodeveloper API token

        try {
          const apiUrl = `https://api.igloodeveloper.co/igloohome/devices/SP2X18346b05/algopin/onetime`;
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
          }

          const result = await response.json();
          const { pin, pinId } = result;

          alert(`Pin: ${pin}, Pin ID: ${pinId}`);

          // Send to the database
          await handleDatabaseSubmission(pin, pinId, intake.name);
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to process the request.");
        } finally {
          setLoading(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleAccept} disabled={loading}>
              {loading ? "Processing..." : "Accept"}
            </DropdownMenuItem>
            <DropdownMenuItem>Decline</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
