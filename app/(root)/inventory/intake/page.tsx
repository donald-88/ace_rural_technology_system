import { intakeAction } from "./action"
import { Intake, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Intake[]> {
  // Fetch data from your API here.
  return [
    {
      intakeId: "728ed52f",
      clientName: "Tanner Smith",
      phone: 1234567890,
      commodity: "Maize",
      variety: "Arabica",
      grade: 1,
      priceKg: 1000,
      grossWeight: 50,
      deductions: 0.1,
      netWeight: 49.9,
      moistureIn: 0.004,
      incomingBagCount: 100,
      numberOfBags: 100,
      time: "10:00 AM",
      date: "2023-08-01",
    },
    {
      intakeId: "728ed52f",
      clientName: "John Smith",
      phone: 265987654321,
      commodity: "Maize",
      variety: "Arabica",
      grade: 1,
      priceKg: 1000,
      grossWeight: 50,
      deductions: 0.1,
      netWeight: 49.9,
      moistureIn: 0.004,
      incomingBagCount: 100,
      numberOfBags: 100,
      time: "10:00 AM",
      date: "2023-08-01",
    }

  ]
}

export default async function Page() {
  const data = await getData()
  await intakeAction()

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
