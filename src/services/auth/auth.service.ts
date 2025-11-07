import serviceA from "@/lib/serviceA"; // choose the service that handles auth
import { AxiosResponse } from "axios";
import { LoginPayload, RegisterPayload, RegisterBusinessOwnerPayload } from "@/types/auth";
import { User } from "@/types/user";

export const AuthService = {
  login: async (payload: LoginPayload) => {
    const res: AxiosResponse<{ access_token: string; user: User }> = await serviceA.post("/api/login", payload);
    return res.data;
  },

  registerBusinessOwner: async (payload: RegisterBusinessOwnerPayload) => {
    // Convert to FormData if logo exists
    const formData = new FormData();
    
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("password", payload.password);
    formData.append("password_confirmation", payload.password_confirmation);
    formData.append("business_name", payload.business_name);
    formData.append("industry", payload.industry);
    formData.append("role", payload.role);
    
    if (payload.logo) {
      formData.append("logo", payload.logo);
    }

    
    const res: AxiosResponse<{ access_token: string; user: User }> = await serviceA.post(
      "/api/register", 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  registerUser: async (payload: RegisterPayload) => {
    const res: AxiosResponse<{ access_token: string; user: User }> = await serviceA.post(
      "/api/register", 
      payload,
    );
    return res.data;
  },

  me: async () => {
    const res = await serviceA.get("/api/user");
    return res.data; // { user }
  },
  
  logout: async () => {
    await serviceA.post("/api/logout");
  },
  
};
