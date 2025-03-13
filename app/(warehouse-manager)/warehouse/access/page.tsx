import { getDeviceInfo, getRecentAccessLog } from "@/lib/actions/access.actions";
import { RequestAccess } from "./requestAccess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Page() {

  const info = await getDeviceInfo()
  const recentAccessLog = await getRecentAccessLog();
  const hasAccess = recentAccessLog.endDate ? new Date(recentAccessLog.endDate) > new Date() : false;

  return (
    <div className="flex flex-col items-center gap-2 h-full p-4">
      {
        info.map((device: any) => (

          <Card key={device.id} className="w-1/2">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <h2 className="text-[13px] uppercase">{device.deviceName}</h2>
                <Badge variant={hasAccess ? "default" : "destructive"}>
                  {
                    hasAccess ? "Unlocked" : "Locked"
                  }
                </Badge>
              </CardTitle>
              <CardDescription>{device.deviceId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center gap-1">
                <div className="flex justify-between">
                  <p className="font-semibold tracking-tight">Access Code</p>
                  <p className="text-muted-foreground text-sm">{recentAccessLog.code}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold tracking-tight">Expiry Date</p>
                  <p className="text-muted-foreground text-sm">{new Date(recentAccessLog.endDate).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      }
    </div>
  );
};



// {
//   hasAccess ? <div className="flex flex-col items-center justify-center text-center">
//     <h2 className="text-xl font-bold tracking-tighter">{recentAccessLog.code}</h2>
//     <p className="text-muted-foreground text-sm">Expires on {new Date(recentAccessLog.endDate).toLocaleString()}</p>
//   </div> : (
//     <div>
//       <h2 className="text-xl font-bold tracking-tighter">You have no access</h2>
//       <p className="text-muted-foreground text-sm">You currently do not have access to the warehouse</p>
//       <RequestAccess deviceInfo={info} />
//     </div>
//   )
// }