import { z } from "zod";

export type Branch = {
    id: number;
    parent_id: number;
    name: string;
    address: string;
    created_at: string;
    updated_at: string;
}

export type BranchResponse = {
    data: Branch[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }
}

export type BranchForm = {
    parent_id?: number;
    name: string;
    address: string;
}

export const branchSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    parent_id: z.number().optional(),
});

export type BranchInput = z.infer<typeof branchSchema>;