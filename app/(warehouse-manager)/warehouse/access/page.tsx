import { getDeviceInfo } from "@/lib/actions/access.actions";
import { RequestAccess } from "./requestAccess";

export default async function Page() {

  const info = await getDeviceInfo()

  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <h2 className="text-xl font-bold tracking-tighter">You have no access</h2>
      <p className="text-muted-foreground text-sm">You currently do not have access to the warehouse</p>
      <RequestAccess deviceInfo={info} />
    </div>
  );
};



