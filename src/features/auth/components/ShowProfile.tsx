"use client";
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  Building2,
  Calendar,
  Settings,
  CircleCheck,
  CircleAlert
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
    const { business } = useAuthStore();
    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['user'],
        queryFn: () => authApi.me(),
    });

    const baseImgUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/storage`;

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (isError) {
        return (
            <div className="p-8 text-center text-destructive animate-in fade-in slide-in-from-top-4">
                <CircleAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">Failed to load profile</h2>
                <p className="text-muted-foreground">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden flex flex-col md:flex-row items-center gap-6 bg-card p-8 rounded-2xl border shadow-lg shadow-primary/5">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <UserIcon size={120} />
                </div>
                
                <div className="relative h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-background shadow-xl">
                    {business?.logo ? (
                        <img 
                            src={`${baseImgUrl}/${business.logo}`} 
                            alt={user?.name} 
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                             <UserIcon className="h-12 w-12 text-primary" />
                             <span className="text-[10px] font-bold text-primary mt-1">WAITLESS</span>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                        {user?.name}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 text-muted-foreground font-medium">
                        <span className="flex items-center justify-center md:justify-start gap-1.5">
                            <Mail className="h-4 w-4 text-primary/70" /> {user?.email}
                        </span>
                        {user?.phone && (
                            <span className="flex items-center justify-center md:justify-start gap-1.5">
                                <Phone className="h-4 w-4 text-primary/70" /> {user?.phone}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 items-center md:items-end">
                    <Badge variant="secondary" className="px-4 py-1 text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
                        {user?.role?.replace('_', ' ')}
                    </Badge>
                    {user?.email_verified_at ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CircleCheck className="h-3 w-3" /> Verified Account
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                            <CircleAlert className="h-3 w-3" /> Verification Pending
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <Card className="border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="h-1 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <UserIcon className="h-5 w-5 text-primary" />
                            Personal Details
                        </CardTitle>
                        <CardDescription>Your account contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</span>
                            <span className="text-sm font-medium p-2 bg-muted/30 rounded-md border border-transparent hover:border-border transition-colors">{user?.name}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</span>
                            <span className="text-sm font-medium p-2 bg-muted/30 rounded-md border border-transparent hover:border-border transition-colors">{user?.email}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</span>
                            <span className="text-sm font-medium p-2 bg-muted/30 rounded-md border border-transparent hover:border-border transition-colors">{user?.phone || 'Not provided'}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Status / Business Info */}
                <Card className="border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="h-1 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Settings className="h-5 w-5 text-primary" />
                            Account Overview
                        </CardTitle>
                        <CardDescription>Security and linked services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Member Since
                                </span>
                                <span className="text-sm font-bold">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Security Level
                                </span>
                                <Badge variant="outline" className="text-[10px] font-bold px-3">
                                    {user?.role === 'business_owner' ? 'HIGH' : 'STANDARD'}
                                </Badge>
                            </div>
                        </div>

                        {user?.business_id && business && (
                             <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-primary uppercase tracking-tighter">Connected Business</span>
                                        <span className="text-sm font-bold">{business.name}</span>
                                    </div>
                                    <Badge variant="outline" className="ml-auto text-[10px]">Active</Badge>
                                </div>
                             </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-card p-8 rounded-2xl border shadow-lg">
                <Skeleton className="h-28 w-28 rounded-full" />
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton className="h-72 rounded-2xl" />
                <Skeleton className="h-72 rounded-2xl" />
            </div>
        </div>
    );
}