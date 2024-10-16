import { Access, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Access[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            name: "Tanner Smith",
            email: "m@example.com",
            reason: "Access to the warehouse",
            role: "Warehouse Manager",
            date: "2024-08-19",
            timeOfEntry: "08:00 AM",
            timeOFExit: "05:00 PM",
        },
        {
            id: "728ed52f",
            name: "Michael Smith",
            email: "michaelsmith@gmail.com",
            reason: "Inspection",
            role: "Warehouse Manager",
            date: "2024-08-19",
            timeOfEntry: "08:00 AM",
            timeOFExit: "05:00 PM",
        },
        
    ]
}

export default async function Page() {
    const data = await getData()

    return (
        <div className="container mx-auto p-4">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
