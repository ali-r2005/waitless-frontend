import api from "@/lib/api";
import { ApiResponse } from "../types";
import { User } from "@/types";

export const staffApi = {
   getStaff: async (page: number = 1, perPage: number = 5) => {
    const response = await api.get<ApiResponse<User[]>>("/staff", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },
}
    