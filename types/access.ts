export interface AccessLogResponse {
    id: string;
    userId: string | null;
    name: string | null;
    lockId: string;
    code: number;
    reason: string;
    role: string | null;
    createdAt: string;
    endDate: string;
}

export interface AccessLogsResult {
    data: AccessLogResponse[];
    total: number;
    pageCount: number;
    error?: string;
}
