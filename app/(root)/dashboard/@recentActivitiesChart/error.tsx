"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error("Recent Activity Chart Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center p-4 text-center bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <p className="text-red-600 font-semibold mt-2">Failed to load Recent Activity.</p>
            <button
                onClick={reset}
                className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md text-sm"
            >
                Retry
            </button>
        </div>
    );
}
