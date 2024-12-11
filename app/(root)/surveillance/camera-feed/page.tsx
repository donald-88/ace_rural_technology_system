"use client"

import CameraView from "@/components/cameraView"

const CameraFeed = () => {
    return (
        <section className="p-4 h-full">
            <div className="grid grid-cols-2 gap-4 w-full h-full">
                <CameraView url="https://g2.ipcamlive.com/player/player.php?alias=6759a0ec585ac" />
                <CameraView url="https://g2.ipcamlive.com/player/player.php?alias=6759a28163422" />
                <CameraView url="https://g2.ipcamlive.com/player/player.php?alias=6759a335f2915" />
                <CameraView url="https://g2.ipcamlive.com/player/player.php?alias=6759a3f2016ab" />
            </div>
        </section>
    )
}

export default CameraFeed