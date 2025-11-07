import serviceA from "@/lib/serviceA"; // choose the service that handles auth
import { AxiosResponse } from "axios";
import { Role, RoleForm, RoleResponse,  } from "@/types/role";

export const RoleService = {
    index: async (page: number = 1): Promise<RoleResponse> => {
        const res = await serviceA.get<RoleResponse>("/api/roles?page=" + page);
        return res.data;
    },
    store: async (role: RoleForm) => {
        const res: AxiosResponse<{ role: Role }> = await serviceA.post("/api/roles", role);
        return res.data;
    },
    update: async (role: RoleForm, id: number) => {
        const res: AxiosResponse<{ role: Role }> = await serviceA.put("/api/roles/" + id, role);
        return res.data;
    },
    destroy: async (id: number) => {
        const res: AxiosResponse<{ role: Role }> = await serviceA.delete("/api/roles/" + id);
        return res.data;
    }
}