import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import Link from 'next/link'; 

interface Entry {
  name: string;
  role: string;
}

interface RecentEntriesProps {
  entries: Entry[];
}

const RecentEntries: React.FC<RecentEntriesProps> = ({ entries }) => {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle className="text-[13px] flex justify-between items-center">
          ACCESS LOGS
          <Link href="/access-logs">
            <Badge className="px-3 py-1.5" variant="outline">
              See All
            </Badge>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p>{entry.name}</p>
              </div>
              <p className="text-secondary">{entry.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
