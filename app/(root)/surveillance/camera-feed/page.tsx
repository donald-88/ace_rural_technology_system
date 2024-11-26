"use client"

import CameraView from "@/components/cameraView"

const CameraFeed = () => {
    return (
        <section className="p-4 h-full">
            <div className="grid grid-cols-2 gap-4 w-full h-full">
                <CameraView  />
                <CameraView  />
                <CameraView  />
                <CameraView />
            </div>
        </section>
    )
}

export default CameraFeed