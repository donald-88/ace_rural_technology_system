import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'


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
                <CardTitle className="text-[13px] flex justify-between">RECENT ENTRIES<button>See all</button></CardTitle>
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
                                        <p className="font-semibold text-sm text-secondary">{entry.name}</p>
                                    </div>
                                    <p className="text-sm tracking-tighter font-light text-secondary">{entry.role}</p>
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