import IntakeForm from "./intake-form";
import { getReceipts } from "@/lib/actions/receipt.actions";

export default function Page() {
  const receipts = getReceipts()
  return (
    <section className="flex justify-center w-full p-4 gap-16">
      <div className="w-1/2">
        <IntakeForm receipts={receipts} />
      </div>
    </section>
  );
}