"use client";
import { useEffect, useRef, RefObject } from 'react';

const CameraFeed = () => {
  const cameraIds = ["360", "entrance", "corridor-2", "corridor-1", "exit"];
  // Explicitly type the ref array
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Initialize refs array
    videoRefs.current = videoRefs.current.slice(0, cameraIds.length);

    // Function to handle automatic playback
    const handlePlayback = async (video: HTMLVideoElement) => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (error) {
        console.error("Playback failed:", error);
      }
    };

    // Set up event listeners for each video element
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) {
        // Create bound event handlers to ensure proper cleanup
        const handlePause = () => handlePlayback(videoRef);
        const handleEnded = () => handlePlayback(videoRef);
        const handleError = async () => {
          console.error("Video error occurred");
          setTimeout(() => handlePlayback(videoRef), 1000);
        };

        videoRef.addEventListener('pause', handlePause);
        videoRef.addEventListener('ended', handleEnded);
        videoRef.addEventListener('error', handleError);

        // Initial playback
        handlePlayback(videoRef);

        // Store event handlers for cleanup
        videoRef.dataset.boundHandlers = 'true';
      }
    });

    // Cleanup event listeners
    return () => {
      videoRefs.current.forEach((videoRef) => {
        if (videoRef && videoRef.dataset.boundHandlers === 'true') {
          const handlePause = () => handlePlayback(videoRef);
          const handleEnded = () => handlePlayback(videoRef);
          const handleError = () => {
            console.error("Video error occurred");
            setTimeout(() => handlePlayback(videoRef), 1000);
          };

          videoRef.removeEventListener('pause', handlePause);
          videoRef.removeEventListener('ended', handleEnded);
          videoRef.removeEventListener('error', handleError);
        }
      });
    };
  }, []);

  return (
    <section className="p-4 h-full">
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {cameraIds.map((cameraId, index) => (
          <div key={cameraId} className="w-full h-full">
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full rounded-lg"
            >
              <source src={`http://localhost:3001/stream?camera=${cameraId}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CameraFeed;