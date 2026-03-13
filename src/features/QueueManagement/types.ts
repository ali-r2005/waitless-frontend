export interface Queue {
    id: number;
    name: string;
    scheduled_date: string;
    is_active: boolean;
    start_time: string;
}

export interface CreateQueueRequest {
    name: string;
    scheduled_date?: string;
    is_active?: boolean;
    start_time?: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
    pagination?: PaginationMeta;
}