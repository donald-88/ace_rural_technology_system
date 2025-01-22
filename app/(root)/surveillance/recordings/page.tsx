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

type PaginationProps = {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
};

function Pagination({ total, page, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  // Helper function to generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showPages = 5; // Number of pages to show
    
    if (totalPages <= showPages) {
      // If total pages are less than or equal to showPages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (page > 3) {
        pageNumbers.push('...');
      }
      
      // Calculate start and end of middle pages
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      
      // Adjust start and end to always show 3 numbers in middle
      if (page <= 3) {
        end = 4;
      }
      if (page >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (page < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="pagination flex items-center justify-center mt-4 space-x-2">
      {/* Previous button */}
      <button
        className={`px-3 py-1 border rounded ${
          page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">...</span>
          ) : (
            <button
              key={index}
              className={`px-3 py-1 border rounded ${
                page === pageNum ? 'bg-green-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
              disabled={page === pageNum}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>

      {/* Next button */}
      <button
        className={`px-3 py-1 border rounded ${
          page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}

function RecordingsPage() {
  // Rest of the RecordingsPage component remains the same
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ cameraId: "", date: "" });

  const limit = 6;

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...filter,
    });

    fetch(`/api/footage/listVideos?${params}`)
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
          className="bg-green-400 text-white px-4 py-2 rounded"
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
              src={`/api/footage/getVideo?filename=${video.filename}`}
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
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}

export default RecordingsPage;