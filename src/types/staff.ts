import { z } from "zod";
import { Branch } from "./branch";
import { buisnessRole } from "./role";

export type Staff = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "staff" | "branch_manager";
    branch: Branch;
    staff:{
        id: number;
        role: buisnessRole;
    }
}

export type StaffRequest = {
    role_id: number;
    branch_id: number;
}

export type StaffResponse = {
    data: Staff[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    }
}

export type userSearchResponse = {
    data: {
        id: number;
        name: string;
        email: string
    }[]
}

export const addStaffSchema = z.object({
    role_id: z.number().min(1, "Please select a role"),
    branch_id: z.number().min(1, "Please select a branch"),
});

export type AddStaffInput = z.infer<typeof addStaffSchema>;