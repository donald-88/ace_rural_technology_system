"use client"

import ReactPlayer from 'react-player'

interface CameraViewProps {
    url: string
}

const CameraView = ({ url }: CameraViewProps) => {
    return (
        <div className="w-full h-full rounded-lg overflow-hidden">
            <iframe src={url} width="100%" height="100%" allowFullScreen> </iframe>
        </div>
    )
}

export default CameraView