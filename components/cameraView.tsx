import { BatteryFullIcon, MoreHorizontal, WifiHigh } from 'lucide-react'

interface CameraViewProps {
    cameraIndex: number
}

const CameraView = ({ cameraIndex }: CameraViewProps) => {
    return (
        <div className="bg-gray-300 rounded-xl">
            <div className="flex flex-col place-content-between h-full">
                <div className="flex justify-between items-center p-3">
                    <div className="flex gap-2 text-white">
                        <WifiHigh size="20" />
                        <BatteryFullIcon size="20" />
                    </div>
                    <div className="flex gap-2">
                        <p className="text-white">86</p>
                        <MoreHorizontal size="20" className="text-white" />
                    </div>
                </div>

                <div className="flex justify-between p-3 text-white">
                    <p>Camera {cameraIndex}</p>
                    <p>15-05-2024  12:18 PM</p>
                </div>
            </div>
        </div>
    )
}

export default CameraView