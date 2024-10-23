"use client"

import DeviceControl from '@/components/deviceControl'
import SensorBarChart from '@/components/sensorBarChart'
import { AlarmSmoke, Footprints, ServerCog, Wifi } from 'lucide-react'
import React from 'react'

const SensorReadings = () => {

    const humidityData = [
        { month: "Monday", reading: 45 },
        { month: "Tuesday", reading: 30 },
        { month: "Wednesday", reading: 23 },
        { month: "Thursday", reading: 73 },
        { month: "Friday", reading: 20 },
        { month: "Saturday", reading: 21 },
        { month: "Sunday", reading: 69 },
    ]

    const temperatureData = [
        { month: "Monday", reading: 18 },
        { month: "Tuesday", reading: 30 },
        { month: "Wednesday", reading: 23 },
        { month: "Thursday", reading: 32 },
        { month: "Friday", reading: 20 },
        { month: "Saturday", reading: 21 },
        { month: "Sunday", reading: 20 },
    ]

    const connectivityData = [
        { month: "Monday", reading: 186 },
        { month: "Tuesday", reading: 305 },
        { month: "Wednesday", reading: 237 },
        { month: "Thursday", reading: 73 },
        { month: "Friday", reading: 209 },
        { month: "Saturday", reading: 214 },
        { month: "Sunday", reading: 209 },
    ]
  return (
    <section className='grid gap-8 p-4'>

        <h2>Statistics for the past week</h2>
        <div className='flex gap-3'>
            <SensorBarChart sensor='Humidity' data={humidityData}/>
            <SensorBarChart sensor='Temperature' data={temperatureData}/>
            <SensorBarChart sensor='Connectivity' data={connectivityData}/>
        </div>

        <h2>My Devices</h2>

        <div className='flex gap-3'>
            <DeviceControl name='Motion Sensor' icon={Footprints}/>
            <DeviceControl name='Smoke Sensor' icon={AlarmSmoke}/>
            <DeviceControl name='Jetson Nano' icon={ServerCog} />
            <DeviceControl name='Wifi Router' icon={Wifi}/>
        </div>
    </section>
  )
}

export default SensorReadings