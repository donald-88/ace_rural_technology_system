import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'


const RecentEntries = () => {

    const recentEntriesList = [
        {
            name: "Jacob Samalani",
            role: "Warehouse Manager"
        },
        {
            name: "Gift Banda Samalani",
            role: "Warehouse Attendant"
        },
        {
            name: "Judith Nyirenda",
            role: "Cleaning Staff"
        },
        {
            name: "Jacob Samalani",
            role: "Warehouse Manager"
        },
    ]
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <CardTitle className="text-[13px] flex justify-between items-center">RECENT ENTRIES<button><Badge className={"px-3 py-1.5"} variant={'outline'}>See All</Badge></button></CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {
                    recentEntriesList.map((entry, index) => {

                        return (
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p>{entry.name}</p>
                                    </div>
                                    <p className='text-secondary'>{entry.role}</p>
                                </div>
                            </div>
                        )
                    }
                    )
                }
            </CardContent>
        </Card>
    )
}

export default RecentEntries