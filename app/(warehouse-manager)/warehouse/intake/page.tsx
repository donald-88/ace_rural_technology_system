import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntakeForm from "./intake-form";
import { getReceipts } from "@/lib/actions/receipt.actions";

export default async function Page() {
  const receipts = getReceipts()
  return (
    <section className="flex justify-center w-full p-4 gap-16">
      <div className="w-1/2">
        <IntakeForm receipts={receipts} />
      </div>
      {/* <div className="flex w-1/3 justify-end gap-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-[13px] flex justify-between items-center">WAREHOUSE RECEIPT SUMMARY</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
      </div> */}
    </section>
  );
}