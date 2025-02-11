"use client";

const CameraFeed = () => {
    const cameraIds = ["360", "entrance", "corridor-2", "corridor-1", "exit"];

    return (
        <section className="p-4 h-fit">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full h-full">
                {cameraIds.map((cameraId) => (
                    <div key={cameraId} className="w-full h-64 md:h-72 lg:h-80 xl:h-96">
                        <video controls autoPlay muted className="w-full h-full rounded-lg">
                            <source src={`/api/footage/stream?camera=${cameraId}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CameraFeed;
