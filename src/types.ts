export interface Business {
    id: number;
    name: string;
    industry: string;
    logo?: string;
}

export type QueueCustomerStatus = 'waiting' | 'late' | 'serving' | 'served' | 'cancelled';

export type Role = 'business_owner' | 'staff' | 'customer';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    phone: string;
    business_id: number | null;
    email_verified_at: string | null;
    created_at: string;
}