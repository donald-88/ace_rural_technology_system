"use client";

import { useState, useEffect } from "react";

function VideoPlayer({ filename }: { filename: string }) {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    setVideoUrl(`/api/getVideo?filename=${filename}`);
  }, [filename]);

  return (
    <div className="video-player">
      <h3>{filename}</h3>
      <video controls width="640" height="360" src={videoUrl}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default function RecordingsPage() {
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/listVideos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <div className="recordings-page">
      <h1>Surveillance Recordings</h1>
      {videos.length ? (
        <div className="video-gallery">
          {videos.map((filename) => (
            <VideoPlayer key={filename} filename={filename} />
          ))}
        </div>
      ) : (
        <p>No videos available.</p>
      )}
    </div>
  );
}
