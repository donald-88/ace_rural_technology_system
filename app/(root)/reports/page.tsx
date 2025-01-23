import { getIntake } from "@/lib/actions/intake.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page() {

  const data = await getIntake()

  return (
    <section className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
       <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
