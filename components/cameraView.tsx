"use client"

const CameraView = () => {

    return (
        <div className="w-full h-full rounded-lg overflow-hidden">
            <video
                src="http://168.253.229.53:80/video1.mjpg" // Replace with your camera's HTTP stream URL
                controls
                autoPlay
                style={{ width: '100%', height: '100%' }}
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