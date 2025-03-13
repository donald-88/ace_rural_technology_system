import { getDeviceInfo, getRecentAccessLog } from "@/lib/actions/access.actions";
import { RequestAccess } from "./requestAccess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  KeyRound,
  Lock,
  Unlock,
  Calendar,
  Clock,
  Battery,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function Page() {
  const devices = await getDeviceInfo();

  // Create an array to store access logs for each device
  const accessLogs = await Promise.all(
    devices.map(async (device) => {
      const log = await getRecentAccessLog(device.deviceId);
      return {
        device,
        log,
        hasAccess: log?.endDate ? new Date(log.endDate) > new Date() : false
      };
    })
  );

  // Calculate time remaining for active access
  const calculateTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) return { hours: 0, minutes: 0 };

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours: diffHrs, minutes: diffMins };
  };

  return (
    <div className="container p-4">
      {accessLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
          <h2 className="text-xl font-bold">No devices found</h2>
          <p className="text-muted-foreground text-sm mt-1">
            No lock devices are currently available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessLogs.map(({ device, log, hasAccess }) => {
            const timeRemaining = hasAccess ? calculateTimeRemaining(log.endDate) : null;

            return (
              <Card key={device.id} className="transition-shadow hover:shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge variant={hasAccess ? "default" : "destructive"}>
                      <div className="flex items-center gap-1">
                        {hasAccess ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        <span>{hasAccess ? "Unlocked" : "Locked"}</span>
                      </div>
                    </Badge>
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      device.batteryLevel > 70 ? "text-primary" :
                        device.batteryLevel > 30 ? "text-yellow-500" : "text-red-500"
                    )}>
                      <Battery className="h-4 w-4" />
                      <span>{device.batteryLevel}%</span>
                    </div>
                  </div>
                  <CardTitle className="text-[13px] uppercase font-bold mt-2">{device.deviceName}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-col text-xs mt-1">
                      <span>ID: {device.deviceId}</span>
                      <span>Type: {device.type}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {hasAccess ? (
                    <div className="space-y-3">
                      <div className="bg-primary-foreground/40 p-3 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Access Code</span>
                          </div>
                          <div className="font-mono font-medium">{log.code}</div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Remaining:</span>
                          </div>
                          <div>
                            {timeRemaining?.hours}h {timeRemaining?.minutes}m
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Start Date:</span>
                          </div>
                          <div>{new Date(log.startDate).toLocaleString()}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Expiry Date:</span>
                          </div>
                          <div>{new Date(log.endDate).toLocaleString()}</div>
                        </div>
                        
                        {'reason' in log && typeof log.reason === 'string' && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <div className="text-muted-foreground mb-0.5">Access Reason:</div>
                            <div className="text-xs">{String(log.reason)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-destructive/2.5 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <h3 className="text-sm font-medium">No Active Access</h3>
                            <p className="text-xs text-muted-foreground">
                              You currently do not have access to this lock
                            </p>
                          </div>
                        </div>
                      </div>

                      <RequestAccess deviceInfo={[device]} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}