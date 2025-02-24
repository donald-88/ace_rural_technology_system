import { getReceipts } from "@/lib/actions/receipt.actions";
import DispatchForm from "./dispatch-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";


export default async function Page() {
  const receipts = await getReceipts()
  return (
    <section className="flex justify-center w-full p-4">
      <Card className="w-[640px]">
        <CardHeader>
          <CardTitle className="text-[13px]">DISPATCH DETAILS</CardTitle>
        </CardHeader>
        <CardContent>
          <DispatchForm allReceipts={receipts} />
        </CardContent>
      </Card>
    </section>
  );
}