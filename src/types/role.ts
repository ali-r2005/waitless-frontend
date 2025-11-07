import { z } from "zod";

export type buisnessRole = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export type RoleResponse = {
    data: buisnessRole[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }
}

export type RoleForm = {
    name: string;
}

export const roleSchema = z.object({
    name: z.string().min(3, "Role name must be at least 3 characters"),
});

export type RoleInput = z.infer<typeof roleSchema>;
