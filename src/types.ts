export interface Businesse {
    business_name: string;
    industry: string;
    logo?: File;
}

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