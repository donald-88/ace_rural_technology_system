"use client"

import React from 'react'
import { Card, CardContent} from './ui/card'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import type {  LucideIcon } from 'lucide-react'

interface DeviceControlProps {
    name: string
    icon: LucideIcon
}

const DeviceControl = ({ name, icon: Icon }: DeviceControlProps) => {
    return (
        <Card className='w-1/4'>
            <CardContent className='grid gap-8 py-10'>
                <div className='flex items-center justify-between'>
                    <div className='bg-muted p-3 rounded-full'>
                        <Icon size={16} className='text-muted-foreground' />
                    </div>
                    <Switch />
                </div>

                <div className='flex justify-between'>
                    <Label>{name}</Label>
                    <Label>On</Label>
                </div>
            </CardContent>
        </Card>
    )
}

export default DeviceControl