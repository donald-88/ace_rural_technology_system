"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ReactPlayer with SSR disabled
const ReactPlayer = dynamic(() => import('react-player'), {
    ssr: false
})

const CameraView = () => {
    // Use state to ensure client-side rendering
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return (
        <div className="w-full h-full">
            <ReactPlayer
                width="100%"
                height="100%"
                url={"http://192.168.1.119:4000"}
                playing={true}
                controls
            />
        </div>
    )
}

export default CameraView


    // < div className = "bg-gray-300 rounded-xl" >
    //     <div className="flex flex-col place-content-between h-full">
    //         <div className="flex justify-between items-center p-3">
    //             <div className="flex gap-2 text-white">
    //                 <WifiHigh size="20" />
    //                 <BatteryFullIcon size="20" />
    //             </div>
    //             <div className="flex gap-2">
    //                 <p className="text-white">86</p>
    //                 <MoreHorizontal size="20" className="text-white" />
    //             </div>
    //         </div>

    //         <div className="flex justify-between p-3 text-white">
    //             <p>Camera {cameraIndex}</p>
    //             <p>15-05-2024  12:18 PM</p>
    //         </div>
    //     </div>
    //     </ >