// components/RecentActivity.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity } from "@/lib/actions/dashboardActions/recentActivity.action";

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[13px] flex justify-between items-center">
          RECENT ACTIVITY
          <button>
            <Badge className={"px-3 py-1.5"} variant={"outline"}>
              See All
            </Badge>
          </button>
        </CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead>#</TableHead>
            <TableHead>TYPE</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>COMMODITY</TableHead>
            <TableHead>VOLUME (Kg)</TableHead>
            <TableHead>MOISTURE</TableHead>
            <TableHead>NO. OF BAGS</TableHead>
            <TableHead>DATE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity, index) => (
            <TableRow key={activity.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{activity.type.toUpperCase()}</TableCell>
              <TableCell>{activity.name}</TableCell>
              <TableCell>{activity.commodity}</TableCell>
              <TableCell>{activity.volume.toLocaleString()}</TableCell>
              <TableCell>
                {activity.moisture !== null ? activity.moisture.toFixed(1) + '%' : 'N/A'}
              </TableCell>
              <TableCell>{activity.noOfBags}</TableCell>
              <TableCell>
                {activity.date.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RecentActivity;