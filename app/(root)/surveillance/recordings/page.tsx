"use client";
import { useState, useEffect } from "react";

// Define the type of the video object
type Video = {
  _id: string;
  filename: string;
  metadata: {
    cameraId: string;
    timestamp: string;
  };
};

function Pagination({ total, page, limit, onPageChange }: any) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pagination flex justify-center mt-4">
      {totalPages > 0 &&
        Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 mx-1 border rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            disabled={page === i + 1}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
    </div>
  );
}

function RecordingsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0); // Total number of videos
  const [page, setPage] = useState(1); // Current page
  const [filter, setFilter] = useState({ cameraId: "", date: "" });

  const limit = 6; // Videos per page

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit), // Pass limit to API
      ...filter,
    });

    fetch(`/api/listVideos?${params}`)
      .then((res) => res.json())
      .then(({ videos, total }) => {
        if (videos && total !== undefined) {
          setVideos(videos);
          setTotal(total);
        } else {
          console.error("Invalid API response structure:", { videos, total });
        }
      })
      .catch((error) => console.error("Error fetching videos:", error));
  }, [page, filter]);

  return (
    <div className="recordings-page px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Surveillance Recordings</h1>

      {/* Filters */}
      <div className="filters flex items-center mb-6 gap-4">
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <select
          value={filter.cameraId}
          onChange={(e) => setFilter({ ...filter, cameraId: e.target.value })}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Cameras</option>
          <option value="360">360</option>
          <option value="entrance">Entrance</option>
          <option value="corridor-1">Corridor 1</option>
          <option value="corridor-2">Corridor 2</option>
          <option value="exit">Exit</option>
        </select>
        <button
          onClick={() => setPage(1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {/* Video Grid */}
      <div className="video-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="video-card border rounded-lg shadow p-4"
          >
            <video
              controls
              className="w-full rounded mb-4"
              src={`/api/getVideo?filename=${video.filename}`}
            />
            <h2 className="font-semibold text-lg">{video.filename}</h2>
            <p className="text-sm text-gray-500">
              Camera: {video.metadata.cameraId}
            </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(video.metadata.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        total={total} // Use actual total videos from the API
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}

export default RecordingsPage;
