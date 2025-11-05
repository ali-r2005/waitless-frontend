import { z } from "zod";

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = { 
  name: string; 
  email: string; 
  phone: string;
  password: string; 
  password_confirmation: string; 
  business_name: string; 
  industry: string; 
  logo: File | null; 
  role: "business_owner" 
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  password_confirmation: z.string().min(6),
  business_name: z.string().min(3),
  industry: z.string().min(3),
  logo: z.instanceof(File).optional(),
  role: z.enum(["business_owner"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;