import { Suspense } from "react";
import IntakeForm from "./intake-form";
import { getReceipts } from "@/lib/actions/receipt.actions";

export default async function Page() {

  const receipts = await getReceipts()

  const data = await fetch("http://localhost:3000/api/acemain", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return (
    <section className="flex justify-center w-full p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <IntakeForm allReceipts={receipts} data={data} />
      </Suspense>
    </section>
  );
}