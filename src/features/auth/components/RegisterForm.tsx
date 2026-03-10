'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { AuthRequest } from '../types';
import { useState } from 'react';
import { registerSchema, RegisterFormValues } from '../schemas/auth.shema';


export default function RegisterForm() {
  const { register: registerUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'customer' | 'business_owner'>('customer');
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Map data to AuthRequest
    const authData: AuthRequest = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      password_confirmation: data.password_confirmation,
      role: data.role,
      // If business_owner, passing these as well (mapping based on interface)
      ...(data.role === 'business_owner' ? {
        industry: data.industry!,
        business_name: data.business_name!,
        logo: data.logo!,
        // We might want to pass business name separately or if the API expects it in 'name'
        // But since we used 'name' for user name, let's see. 
        // For now, I'll follow the user's intent.
      } : {}),
    };
    
    // I'll assume the API might need the business name in its own field if we have it
    // But since the interface says AuthRequest extends Businesse, maybe 'name' is the business name for business owners?
    // Let's stick to the shared schema for now.
    
    await registerUser(authData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Join Waitless to start managing your time better</CardDescription>
      </CardHeader>
      
      <Tabs 
        defaultValue="customer" 
        value={activeTab} 
        onValueChange={(val) => {
          const role = val as 'customer' | 'business_owner';
          setActiveTab(role);
          setValue('role', role);
        }} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 px-6">
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="business_owner">Business Owner</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Full Name</label>
              <Input
                {...register('name')}
                placeholder="John Doe"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Phone (Optional)</label>
              <Input
                {...register('phone')}
                placeholder="+1 234 567 890"
              />
            </div>

            <TabsContent value="business_owner" className="space-y-4 pt-0 mt-0">
               <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Business Name</label>
                <Input
                  {...register('business_name')}
                  placeholder="ACME Corp"
                  className={errors.business_name ? 'border-red-500' : ''}
                />
                {errors.business_name && <p className="text-sm text-red-500">{errors.business_name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Industry</label>
                <Input
                  {...register('industry')}
                  placeholder="Healthcare, Retail, etc."
                  className={errors.industry ? 'border-red-500' : ''}
                />
                {errors.industry && <p className="text-sm text-red-500">{errors.industry.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Business Logo</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue('logo', file);
                    }
                  }}
                  className={errors.logo ? 'border-red-500' : ''}
                />
                {errors.logo && <p className="text-sm text-red-500">{(errors.logo as any).message}</p>}
              </div>
            </TabsContent>


            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Password</label>
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Confirm Password</label>
              <Input
                {...register('password_confirmation')}
                type="password"
                placeholder="••••••••"
                className={errors.password_confirmation ? 'border-red-500' : ''}
              />
              {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  );
};
