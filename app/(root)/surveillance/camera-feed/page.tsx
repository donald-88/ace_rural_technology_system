import CameraView from "@/components/cameraView"

const CameraFeed = () => {
    return (
        <section className="p-4 h-full">
            <div className="grid grid-cols-2 gap-4 w-full h-full">
                <CameraView cameraIndex={1} />
                <CameraView cameraIndex={2} />
                <CameraView cameraIndex={3} />
                <CameraView cameraIndex={4} />
            </div>
        </section>
    )
}

export default CameraFeed