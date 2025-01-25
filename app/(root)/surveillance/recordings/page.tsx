"use client";
import { useState, useEffect } from "react";

type Video = {
  _id: string;
  filename: string;
  metadata: {
    cameraId: string;
    timestamp: string;
  };
};

type GroupedVideos = Record<
  string,
  Record<string, Record<string, Record<string, Video[]>>>
>;

function RecordingsPage() {
  const [groupedVideos, setGroupedVideos] = useState<GroupedVideos>({});
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/footage/listVideos")
      .then((res) => res.json())
      .then(({ groupedVideos }) => setGroupedVideos(groupedVideos))
      .catch((error) => console.error("Error fetching grouped videos:", error));
  }, []);

  const navigateTo = (folder: string) => {
    setCurrentPath([...currentPath, folder]);
  };

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const getCurrentFolderContent = () => {
    let content: any = groupedVideos;
    for (const folder of currentPath) {
      content = content[folder];
    }
    return content;
  };

  const content = getCurrentFolderContent();

  return (
    <div className="recordings-page px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Surveillance Recordings</h1>

      {currentPath.length > 0 && (
        <button
          onClick={navigateBack}
          className="mb-4 px-4 py-2 bg-gray-300 rounded"
        >
          Back
        </button>
      )}

      {typeof content === "object" && !Array.isArray(content) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(content).map((key) => (
            <div
              key={key}
              className="folder-card border p-4 rounded shadow cursor-pointer bg-gray-100 hover:bg-gray-200"
              onClick={() => navigateTo(key)}
            >
              {key}
            </div>
          ))}
        </div>
      ) : (
        <div className="video-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content?.map((video: Video) => (
            <div
              key={video._id}
              className="video-card border rounded-lg shadow p-4"
            >
              <video
                controls
                className="w-full rounded mb-4"
                src={`/api/footage/getVideo?filename=${video.filename}`}
              />
              <h2 className="font-semibold text-lg">{video.filename}</h2>
              <p className="text-sm text-gray-500">
                Camera: {video.metadata.cameraId}
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(video.metadata.timestamp).toLocaleString("en-US", {
                  dateStyle: "full",
                })}
              </p>
              <p className="text-sm text-gray-500">
                Time: {new Date(video.metadata.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecordingsPage;
