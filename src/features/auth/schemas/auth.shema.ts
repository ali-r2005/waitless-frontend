import * as z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password_confirmation: z.string().min(6, 'Please confirm your password'),
  role: z.enum(['customer', 'business_owner']),
  // Business fields (only required if role is business_owner)
  business_name: z.string().optional(),
  industry: z.string().optional(),
  logo: z.instanceof(File).optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
}).refine((data) => {
  if (data.role === 'business_owner') {
    return !!data.business_name && !!data.industry;
  }
  return true;
}, {
  message: "Business name and industry are required for business owners",
  path: ["business_name"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;