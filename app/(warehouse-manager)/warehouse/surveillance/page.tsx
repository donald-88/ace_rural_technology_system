"use client";
import React from 'react';

const CameraFeed = () => {
    const cameraIds = ["360", "entrance", "corridor-2", "corridor-1", "exit"];

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cameraIds.map((cameraId) => (
                    <div key={cameraId} className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                        <video
                            className="w-full aspect-video object-cover"
                            autoPlay
                            playsInline
                            muted
                            loop
                        >
                            <source src={`/api/cameras/${cameraId}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                            <h3 className="text-white font-medium text-sm">Camera {cameraId}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CameraFeed;