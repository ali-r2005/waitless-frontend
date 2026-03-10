import { Businesse } from "@/types";

export interface AuthRequest extends Partial<Businesse> {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role?: 'customer' | 'business_owner';
}