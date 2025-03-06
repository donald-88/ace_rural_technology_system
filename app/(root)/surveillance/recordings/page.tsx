"use client";
import { useState, useEffect } from "react";
import { FileVideo, Camera, FolderOpen, ArrowLeft } from "lucide-react";

type Video = {
  _id: string;
  filename: string;
  metadata: {
    cameraId: string;
    timestamp: string;
  };
};

type Snapshot = {
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

type GroupedSnapshots = Record<
  string,
  Record<string, Record<string, Record<string, Snapshot[]>>>
>;

function RecordingsPage() {
  const [groupedVideos, setGroupedVideos] = useState<GroupedVideos>({});
  const [groupedSnapshots, setGroupedSnapshots] = useState<GroupedSnapshots>({});
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [view, setView] = useState<"videos" | "snapshots">("videos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      const endpoint = view === "videos" 
        ? "/api/footage/listVideos" 
        : "/api/footage/listSnapshots";
      
      fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          console.log("API Response:", data); // Log the API response
          view === "videos" 
            ? setGroupedVideos(data.groupedVideos || {})
            : setGroupedSnapshots(data.groupedSnapshots || {});
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    };

    fetchData();
  }, [view]);

  const navigateTo = (folder: string) => {
    const content = view === "videos" ? groupedVideos : groupedSnapshots;
    let currentContent: any = content;

    // Check if the folder exists in the current content
    for (const path of currentPath) {
      if (!currentContent || !currentContent[path]) {
        console.error(`Invalid path: ${path} not found in content`);
        setCurrentPath([]); // Reset path if invalid
        return;
      }
      currentContent = currentContent[path];
    }

    if (!currentContent || !currentContent[folder]) {
      console.error(`Invalid path: ${folder} not found in content`);
      return; // Do not navigate if the folder doesn't exist
    }

    setCurrentPath(prev => [...prev, folder]);
  };

  const navigateBack = () => {
    setCurrentPath(prev => prev.slice(0, -1));
  };

  const getCurrentFolderContent = () => {
    let content: any = view === "videos" ? groupedVideos : groupedSnapshots;
    for (const folder of currentPath) {
      if (!content || !content[folder]) {
        console.error(`Invalid path: ${folder} not found in content`);
        return {}; // Return an empty object if the path is invalid
      }
      content = content[folder];
    }
    return content;
  };

  const content = getCurrentFolderContent();

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="recordings-page container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          {currentPath.length > 0 && (
            <button 
              onClick={navigateBack} 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          Surveillance Recordings
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setView("videos")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ease-in-out ${
              view === "videos"
                ? "bg-green-100 text-green-700 shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            <FileVideo className="w-5 h-5" />
            Videos
          </button>
          <button
            onClick={() => setView("snapshots")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ease-in-out ${
              view === "snapshots"
                ? "bg-green-100 text-green-700 shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            <Camera className="w-5 h-5" />
            Snapshots
          </button>
        </div>
      </div>

      {typeof content === "object" && !Array.isArray(content) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.keys(content).map((key) => (
            <div
              key={key}
              className="folder-card border-2 border-gray-200 p-5 rounded-xl cursor-pointer 
              bg-white hover:bg-green-50 hover:border-green-200 
              transition-all duration-300 ease-in-out 
              transform hover:-translate-y-1 hover:scale-105 
              flex items-center gap-3 shadow-md hover:shadow-lg"
              onClick={() => navigateTo(key)}
            >
              <FolderOpen className="w-8 h-8 text-green-600" />
              <span className="font-semibold text-gray-800">{key}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="video-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content?.map((item: Video | Snapshot) => (
            <div
              key={item._id}
              className="video-card border-2 border-gray-200 rounded-xl overflow-hidden 
              shadow-md hover:shadow-xl transition-all duration-300 ease-in-out 
              transform hover:-translate-y-2 bg-white"
            >
              {view === "videos" ? (
                <video
                  controls
                  className="w-full h-48 object-cover"
                  src={`/api/footage/getVideo?filename=${(item as Video).filename}`}
                />
              ) : (
                <img
                  src={`/api/footage/getSnapshot?filename=${(item as Snapshot).filename}`}
                  alt="Snapshot"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-800 mb-2 truncate">
                  {item.filename}
                </h2>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4 text-green-600" />
                    Camera: {item.metadata.cameraId}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <FolderOpen className="w-4 h-4 text-green-600" />
                    Date: {new Date(item.metadata.timestamp).toLocaleString("en-US", {
                      dateStyle: "full",
                    })}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <FileVideo className="w-4 h-4 text-green-600" />
                    Time: {new Date(item.metadata.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecordingsPage;