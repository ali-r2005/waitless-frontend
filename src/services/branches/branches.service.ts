import serviceA from "@/lib/serviceA"; // choose the service that handles auth
import { AxiosResponse } from "axios";
import { Branch, BranchForm, BranchResponse,  } from "@/types/branch";

export const BranchService = {
    index: async (page: number = 1): Promise<BranchResponse> => {
        const res = await serviceA.get<BranchResponse>("/api/branches?page=" + page);
        return res.data;
    },
    store: async (branch: BranchForm) => {
        const res: AxiosResponse<{ branch: Branch }> = await serviceA.post("/api/branches", branch);
        return res.data;
    },
    update: async (branch: BranchForm, id: number) => {
        const res: AxiosResponse<{ branch: Branch }> = await serviceA.put("/api/branches/" + id, branch);
        return res.data;
    },
    destroy: async (id: number) => {
        const res: AxiosResponse<{ branch: Branch }> = await serviceA.delete("/api/branches/" + id);
        return res.data;
    }
}