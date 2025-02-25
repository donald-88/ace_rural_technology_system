import { getReceipts } from "@/lib/actions/receipt.actions";
import DispatchForm from "./dispatch-form";

export default async function Page() {
  const receipts = await getReceipts()
  return (
    <section className="flex justify-center w-full p-4">
      <DispatchForm allReceipts={receipts} />
    </section>
  );
}