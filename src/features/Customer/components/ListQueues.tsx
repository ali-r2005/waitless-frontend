"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { QueueCustomer } from "../types";
import customerApi from "../services/customer.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiResponse } from "@/features/QueueManagement/types";
import { 
    Clock, 
    Calendar, 
    Ticket, 
    CheckCircle2, 
    Activity, 
    ChevronRight,
    Search,
    History,
    MoreVertical,
    Ban,
    Trash2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AlertDialogDestructive } from "@/components/shared/destructive-confirm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useActionsHook from "../hooks/useActionsHook";

export default function ListQueues() {
    const [searchQuery, setSearchQuery] = useState("");
    const queryClient = useQueryClient();

    const { data: apiResponse, isLoading, isError } = useQuery<ApiResponse<QueueCustomer[]>>({
        queryKey: ["customer-queues"],
        queryFn: customerApi.getQueues,
    });

    useActionsHook();

    // const cancelMutation = useMutation({
    //     mutationFn: (id: number) => customerApi.cancelQueue(id),
    //     onSuccess: () => {
    //         toast.success("Registration cancelled");
    //         queryClient.invalidateQueries({ queryKey: ["customer-queues"] });
    //     },
    //     onError: (error: any) => {
    //         toast.error(error?.response?.data?.message || "Failed to cancel");
    //     }
    // });

    const removeMutation = useMutation({
        mutationFn: (id: number) => customerApi.removeQueue(id),
        onSuccess: () => {
            toast.success("History item removed");
            queryClient.invalidateQueries({ queryKey: ["customer-queues"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to remove item");
        }
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 space-y-4 max-w-4xl mt-8">
                <div className="space-y-2 mb-8 text-left">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4 text-center mt-20">
                <h2 className="text-xl font-semibold text-destructive">Failed to load queue history</h2>
                <p className="text-muted-foreground mt-2">Please try again later or contact support.</p>
            </div>
        );
    }

    const isActive = (status: string) => ["waiting", "serving"].includes(status.toLowerCase());

    const queues = apiResponse?.data || [];

    const filteredQueues = queues.filter(queue => 
        queue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        queue.pivot.ticket_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-4xl mt-4 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <History className="h-8 w-8 text-primary" />
                        Queue History
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage your current and previous queue positions
                    </p>
                </div>
                
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search queues..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
            </div>

            <Separator className="opacity-50" />

            <div className="grid gap-6">
                {filteredQueues && filteredQueues.length > 0 ? (
                    filteredQueues.map((queue, index) => {
                        const status = queue.pivot.status;
                        const active = isActive(status);

                        return (
                            <Card 
                                key={index} 
                                className={`overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 ${
                                    active 
                                    ? "bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent ring-1 ring-primary/20" 
                                    : "bg-card/50"
                                }`}
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row items-stretch">
                                        {/* Status Indicator Bar */}
                                        <div className={`w-1.5 sm:w-2 ${
                                            active ? "bg-primary animate-pulse" : "bg-muted"
                                        }`} />
                                        
                                        <div className="flex-1 flex flex-col sm:flex-row justify-between items-stretch">
                                            {/* Left side: Main Info (Clickable) */}
                                            <Link 
                                                href={`/customer/${queue.pivot.id}`}
                                                className="flex-1 p-6 flex flex-col sm:flex-row justify-between gap-6 group"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                                            {queue.name}
                                                        </h3>
                                                        {active && (
                                                            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 animate-in fade-in zoom-in duration-500">
                                                                <Activity className="h-3 w-3 mr-1" />
                                                                Active Now
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{queue.scheduled_date || "No date set"}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Started at {queue.start_time}</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                            <Ticket className="h-4 w-4 text-primary/70" />
                                                            <span className="font-medium text-foreground">
                                                                Ticket: {queue.pivot.ticket_number}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                            <CheckCircle2 className={`h-4 w-4 ${status === 'served' ? 'text-green-500' : 'text-muted-foreground'}`} />
                                                            <span className="capitalize">{status}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-end items-end pb-1">
                                                    <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                        View Details
                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Right side: Position & Actions (Non-clickable link area) */}
                                            <div className="p-6 pt-2 sm:pt-6 flex flex-col justify-between items-end gap-4 min-w-[140px] border-t sm:border-t-0 sm:border-l border-muted/30">
                                                <div className="flex items-center gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            {/* {isActive(status) && (
                                                                <>
                                                                    <AlertDialogDestructive
                                                                        title="Cancel Queue Registration?"
                                                                        description={`You will be removed from ${queue.name}. This cannot be undone.`}
                                                                        onAction={() => cancelMutation.mutate(queue.pivot.id)}
                                                                        buttonText={{ action: "Cancel Position", cancel: "Go Back" }}
                                                                    >
                                                                        <DropdownMenuItem 
                                                                            onSelect={(e) => e.preventDefault()} 
                                                                            className="text-destructive focus:text-destructive"
                                                                        >
                                                                            <Ban className="h-4 w-4 mr-2" />
                                                                            Cancel Position
                                                                        </DropdownMenuItem>
                                                                    </AlertDialogDestructive>
                                                                    <DropdownMenuSeparator />
                                                                </>
                                                            )} */}
                                                            
                                                            <AlertDialogDestructive
                                                                title="Remove from History?"
                                                                description="This will hide this entry from your history. If you are currently in this queue, you will also be removed."
                                                                onAction={() => removeMutation.mutate(queue.pivot.id)}
                                                                buttonText={{ action: "Remove", cancel: "Keep it" }}
                                                            >
                                                                <DropdownMenuItem 
                                                                    onSelect={(e) => e.preventDefault()} 
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Remove from History
                                                                </DropdownMenuItem>
                                                            </AlertDialogDestructive>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    <div className="text-right">
                                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                                                            Position
                                                        </p>
                                                        <p className="text-4xl font-bold text-primary tabular-nums">
                                                            #{queue.pivot.position}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Card className="border-dashed bg-muted/20">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                            <div className="p-4 bg-muted rounded-full">
                                <History className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium">
                                    {searchQuery ? "No matches found" : "No queue history found"}
                                </h3>
                                <p className="text-muted-foreground max-w-sm">
                                    {searchQuery 
                                        ? `We couldn't find any queues matching "${searchQuery}"`
                                        : "You haven't joined any queues yet. Once you join a queue, it will appear here."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
