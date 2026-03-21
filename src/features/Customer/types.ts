export interface CustomerUpdate {
    type: string;
    receiver_id: number;
    queue_id: number;
    queue_name: string;
    ticket_number: string;
    position: number;
    status: string;
}