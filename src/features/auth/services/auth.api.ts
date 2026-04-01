import api from "@/lib/api";
import { AuthRequest } from "../types";
import { User } from "@/types";

export const authApi = {
  async login(data: { email: string, password: string }) {
    const response = await api.post("/login", data);
    return response.data;
  },

  async register(data: AuthRequest) {
    const formData = new FormData();
    console.log('i just created the form data object');

    // Append all fields dynamically
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (value instanceof File) {
        formData.append(key, value); // File handled natively
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await api.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log('response from api', response);
    return response.data;
},

  async logout() {
    const response = await api.post("/logout");
    return response.data;
  },

  async me() {
    const response = await api.get("/user");
    return response.data as User;
  },

  // async refresh() {
  //   const response = await api.post("/refresh");
  //   return response.data;
  // },

};