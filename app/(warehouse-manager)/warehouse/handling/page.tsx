import { getReceipts } from "@/lib/actions/receipt.actions";
import HandlingForm from "./handling-form";

export default async function Page() {

  const receipts = await getReceipts()
  return (
    <section className="flex justify-center w-full p-4">
      <HandlingForm allReceipts={receipts} />
    </section>
  );
}
