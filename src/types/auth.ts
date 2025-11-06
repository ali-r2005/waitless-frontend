import { z } from "zod";

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = { 
  name: string; 
  email: string; 
  phone: string;
  password: string; 
  password_confirmation: string; 
};

export type RegisterBusinessOwnerPayload = RegisterPayload & { 
  business_name: string; 
  industry: string; 
  logo: File | null; 
  role: "business_owner"
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Base schema for common fields
const baseRegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

// Schema for normal user registration
export const normalUserSchema = baseRegisterSchema;

// Schema for business owner registration
export const businessOwnerSchema = baseRegisterSchema.safeExtend({
  business_name: z.string().min(3, "Business name must be at least 3 characters"),
  industry: z.string().min(1, "Please select an industry"),
  logo: z.instanceof(File).optional(),
});


export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof normalUserSchema>;
export type BusinessOwnerInput = z.infer<typeof businessOwnerSchema>;