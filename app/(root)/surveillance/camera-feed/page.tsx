"use client";

import CameraView from "@/components/cameraView";

const CameraFeed = () => {
  const cameraIds = ["360", "entrance", "corridor-2", "corridor-1", "exit"];

  return (
    <section className="p-4 h-full">
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {cameraIds.map((cameraId) => (
          <div key={cameraId} className="w-full h-full ">
            <video controls autoPlay muted className="w-full h-full rounded-lg">
              <source src={`/api/stream?camera=${cameraId}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CameraFeed;
