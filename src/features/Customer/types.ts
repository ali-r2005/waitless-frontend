export interface CustomerUpdate {
    type: string;
    receiver_id: number;
    queue_id: number;
    queue_name: string;
    ticket_number: string;
    position: number;
    status: string;
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