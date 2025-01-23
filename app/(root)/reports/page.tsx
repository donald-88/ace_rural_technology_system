import { getIntake } from "@/lib/actions/intake.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import StatisticsCard from "@/components/statisticsCard";
import { Anvil, Download, Leaf, Share, Sprout, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Share1Icon, Share2Icon } from "@radix-ui/react-icons";

export default async function Page() {

  const data = await getIntake()

  return (
    <section className="w-full overflow-x-hidden">
      <div className="container grid gap-4 mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-13px"></h3>
          <div className="flex gap-2">
            <Button variant={"outline"} className="flex gap-2">
              <Share1Icon />
              <p>Share</p>
            </Button>
            <Button className="flex gap-2">
              <Share2Icon />
              <p>Export</p>
            </Button>
          </div>
        </div>
        <div className="flex gap-4">
          <StatisticsCard title={"Holders"} value={"12"} trend={"+2"} icon={Users} />
          <StatisticsCard title={"Commodities"} value={"12"} trend={"+2"} icon={Leaf} />
          <StatisticsCard title={"Commodity Varieties"} value={"12"} trend={"+2"} icon={Sprout} />
          <StatisticsCard title={"Net Weight"} value={"12"} trend={"-416"} icon={Anvil} />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
