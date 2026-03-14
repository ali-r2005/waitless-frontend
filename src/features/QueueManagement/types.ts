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

export interface CustomerQueue {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    business_id: number | null;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
    pivot: {
        queue_id: number;
        user_id: number;
        status: string;
        ticket_number: string;
        served_at: string | null;
        start_serving_at: string | null;
        late_at: string | null;
        position: number;
    };
}

export interface ApiResponse<T> {
    status: string;
    data: T;
    pagination?: PaginationMeta;
}