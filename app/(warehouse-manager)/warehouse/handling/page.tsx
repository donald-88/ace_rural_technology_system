import { getReceipts } from "@/lib/actions/receipt.actions";
import HandlingForm from "./handling-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {

  const receipts = await getReceipts()
  return (
    <section className="flex justify-center w-full p-4">
      <Card className="w-[640px]">
        <CardHeader>
          <CardTitle className="text-[13px]">HANDLING DETAILS</CardTitle>
        </CardHeader>
        <CardContent>
          <HandlingForm allReceipts={receipts} />
        </CardContent>
      </Card>
    </section>
  );
}
