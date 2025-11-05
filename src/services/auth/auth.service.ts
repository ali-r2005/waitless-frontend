import serviceA from "@/lib/serviceA"; // choose the service that handles auth
import { AxiosResponse } from "axios";
import { LoginPayload, RegisterPayload } from "@/types/auth";
import { User } from "@/types/user";

export const AuthService = {
  login: async (payload: LoginPayload) => {
    const res: AxiosResponse<{ access_token: string; user: User }> = await serviceA.post("/api/login", payload);
    return res.data;
  },

  register: async (payload: RegisterPayload) => {
    const res: AxiosResponse<{ access_token: string; user: User }> = await serviceA.post("/api/register", payload);
    return res.data;
  },

  me: async () => {
    const res = await serviceA.get("/api/user");
    return res.data; // { user }
  },

  // optional refresh if backend supports it
//   refresh: async () => {
//     const res = await serviceA.post("/api/refresh");
//     return res.data; // { token }
//   },
};
