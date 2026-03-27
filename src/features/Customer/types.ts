export interface CustomerUpdate {
    queue_state?: string | null;
    is_paused: 0 | 1;
    queue_name: string;
    ticket_number: string;
    position: number;
    status: string;
    estimated_waiting_time: string;
}

export interface QueueCustomer {
    id: number;
    name: string;
    scheduled_date: string | null;
    is_active: number;
    is_paused: number;
    start_time: string;
    preferences: string | null;
    pivot: {
        user_id: number;
        queue_id: number;
        id: number;
        status: string;
        ticket_number: string;
        served_at: string;
        late_at: string;
        position: number;
    }
}

type EventActions = "added" | "removed" | "call" | "served";

export interface ActionPayload {
    action: EventActions;
    message: string;
}
