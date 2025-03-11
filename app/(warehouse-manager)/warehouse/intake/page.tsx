import IntakeForm from "./intake-form";
import { getReceipts } from "@/lib/actions/receipt.actions";

export default async function Page() {
  const receipts = await getReceipts()
  const clients = await fetch("http://localhost:3000/api/acemain/clients", {
    method: "GET",
    next: {
      revalidate: 60,
    }
  }).then((res) => res.json());

  return (
    <section className="flex justify-center w-full gap-4 p-4">
      <IntakeForm allReceipts={receipts} data={clients} />
    </section>
  );
}