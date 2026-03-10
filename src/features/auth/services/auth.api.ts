import api from "@/lib/api";
import { AuthRequest } from "../types";

export const authApi = {
  async login(data: { email: string, password: string }) {
    const response = await api.post("/login", data);
    return response.data;
  },

  async register(data: AuthRequest) {
    const response = await api.post("/register", data);
    return response.data;
  },

  async logout() {
    const response = await api.post("/logout");
    return response.data;
  },

  async me() {
    const response = await api.get("/user");
    return response.data;
  },

};