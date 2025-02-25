"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function recentActivitiesChartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Recent Activities Chart error:", error);
  }, [error]);

  return (
    <Card className="h-full">
      <CardHeader className="items-start pb-2">
        <CardTitle className="text-red-500 flex items-center gap-2 text-[13px]">
          <AlertCircle size={16} />
          Error Loading Recent Activities Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Unable to load warehouse Recent Activities data.
        </p>
        <button
          onClick={reset}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs"
        >
          Retry
        </button>
      </CardContent>
    </Card>
  );
}