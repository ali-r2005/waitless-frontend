import { QueueCustomerStatus } from "@/types";

export interface Queue {
    id: number;
    name: string;
    scheduled_date: string;
    is_active: boolean;
    start_time: string;
    average_waiting_time : number;
    is_paused: boolean;
}

export interface CreateQueueRequest {
    name: string;
    scheduled_date?: string;
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
    pivot: {
        id: number;
        queue_id: number;
        user_id: number;
        status: QueueCustomerStatus;
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
    queue: Queue;
    positions: number | null;
    pagination?: PaginationMeta;
}


type EventActions = "removed";

export interface ActionPayload {
    action: EventActions;
    message: string;
}