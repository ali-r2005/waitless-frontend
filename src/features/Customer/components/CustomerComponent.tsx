"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import echo from "@/lib/echo";
import { CustomerUpdate } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import customerApi from "../services/customer.api";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, User, Ticket, Activity, Info, Ban, Clock, PauseCircle, Timer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertDialogDestructive } from "@/components/shared/destructive-confirm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useActionsHook from "../hooks/useActionsHook";   

export default function CustomerComponent({ CustomerQueueId }: { CustomerQueueId: number }) {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["customer-queue", CustomerQueueId],
        queryFn: () => customerApi.getQueueCustomerById(CustomerQueueId),
    });

    const cancelMutation = useMutation({
        mutationFn: () => customerApi.removeQueue(CustomerQueueId),
        onSuccess: () => {
            toast.success("Queue registration cancelled");
            queryClient.invalidateQueries({ queryKey: ["customer-queue", CustomerQueueId] });
            queryClient.invalidateQueries({ queryKey: ["customer-queues"] });
            router.push("/customer");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to cancel queue");
        }
    });

    useActionsHook();

    const [customerInfo, setCustomerInfo] = useState<CustomerUpdate>({
        queue_state: null,
        is_paused: 0,
        queue_name: "N/A",
        ticket_number: "N/A",
        position: 0,
        status: "N/A",
        estimated_waiting_time: "N/A",
    });

    // Synchronize API data into local state when it arrives
    useEffect(() => {
        if (data?.data?.status === "served" || data?.data?.status === "cancelled") {
            router.push("/customer");
        }
        if (data) {
            setCustomerInfo({
                queue_state: data.data.queue_state || null,
                is_paused: data.data.is_paused || 0,
                queue_name: data.data.queue?.name || "N/A",
                ticket_number: data.data.ticket_number || "N/A",
                position: data.data.position || 0,
                status: data.data.status || "N/A",
                estimated_waiting_time: data.data.estimated_waiting_time || "N/A",
            });
        }
    }, [data, user?.id]);

    const handler = (payload: { update: CustomerUpdate }) => {
        console.log("updateeee", payload);
        setCustomerInfo({
                queue_state: payload.update.queue_state || null,
                is_paused: payload.update.is_paused || 0,
                queue_name: payload.update.queue_name || "N/A",
                ticket_number: payload.update.ticket_number || "N/A",
                position: payload.update.position || 0,
                status: payload.update.status || "N/A",
                estimated_waiting_time: payload.update.estimated_waiting_time || "N/A",
            });
    }

    const queueId = data?.data?.queue_id;

    useEffect(() => {
        console.log("user", user);
        console.log('id', user?.id);
        console.log("queueId", queueId);
        if (!user?.id || !queueId) return;

        let channel: any;
        
        echo().then((echoInstance) => {
            console.log("echoInstance", echoInstance); 
            channel = echoInstance.private(`update.${user.id}.queue.${queueId}`)
                .listen('SendUpdate', handler);
        });
        console.log("channel", channel);

        return () => {
            if (channel) {
                channel.stopListening('SendUpdate');
            }
        };
    }, [user?.id, queueId]);

    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case "serving": return "default";
            case "waiting": return "secondary";
            case "late": return "destructive";
            default: return "outline";
        }
    };

    const canCancel = ["waiting", "late"].includes(customerInfo.status?.toLowerCase());

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-6">
                    <div className="space-y-2 text-center">
                        <Skeleton className="h-10 w-64 mx-auto" />
                    </div>
                    <Card className="shadow-lg border-none overflow-hidden">
                        <CardHeader className="text-center pb-2 bg-muted/50">
                            <Skeleton className="h-8 w-40 mx-auto" />
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6 bg-card">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-3 border-muted/50 last:border-0 last:pb-0">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <Alert variant="destructive" className="shadow-lg border-none">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="text-lg font-bold">Connection Failed</AlertTitle>
                        <AlertDescription className="mt-2 text-sm opacity-90">
                            We were unable to fetch your current queue status. This might be due to a temporary network issue.
                        </AlertDescription>
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                        </div>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="space-y-1 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Stay on Track
                    </h1>
                    <p className="text-muted-foreground">Detailed status of your progress</p>
                </div>

                <Card className="shadow-2xl border-none overflow-hidden group">
                    <div className="h-2 w-full bg-primary" />
                    <CardHeader className="text-center pb-2 bg-muted/20">
                        <CardDescription className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-1">
                            Your Current Queue
                        </CardDescription>
                        <CardTitle className="text-2xl font-black text-foreground italic flex items-center justify-center gap-2">
                            {customerInfo.queue_name}
                            {customerInfo.is_paused === 1 && (
                                <Badge variant="destructive" className="animate-pulse ml-2">
                                    <PauseCircle className="h-3 w-3 mr-1" />
                                    Paused
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-8 px-8">
                        {/* Name Row */}
                        <div className="flex items-center justify-between border-b pb-4 border-muted/50 group-hover:bg-muted/10 transition-colors rounded-sm -mx-2 px-2">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                <User className="h-4 w-4" />
                                <span>Guest</span>
                            </div>
                            <span className="text-foreground font-bold">
                                {user?.name || "Loading..."}
                            </span>
                        </div>

                        {/* Status Row */}
                        <div className="flex items-center justify-between border-b pb-4 border-muted/50 group-hover:bg-muted/10 transition-colors rounded-sm -mx-2 px-2">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                <Activity className="h-4 w-4" />
                                <span>Current Status</span>
                            </div>
                            <Badge variant={getStatusVariant(customerInfo.status) } className="capitalize px-4 py-0.5 font-bold shadow-sm">
                                {customerInfo.status}
                            </Badge>
                        </div>

                        {/* Ticket Row */}
                        <div className="flex items-center justify-between border-b pb-4 border-muted/50 group-hover:bg-muted/10 transition-colors rounded-sm -mx-2 px-2">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                <Ticket className="h-4 w-4" />
                                <span>Ticket Number</span>
                            </div>
                            <span className="text-foreground font-mono text-xl font-black bg-muted/30 px-3 rounded-md ring-1 ring-muted">
                                {customerInfo.ticket_number}
                            </span>
                        </div>

                        {/* Waiting Time Row */}
                        <div className="flex items-center justify-between border-b pb-4 border-muted/50 group-hover:bg-muted/10 transition-colors rounded-sm -mx-2 px-2">
                            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                                <Timer className="h-4 w-4" />
                                <span>Est. Wait Time</span>
                            </div>
                            <span className="text-foreground font-bold flex items-center gap-1">
                                <Clock className="h-3 w-3 text-primary" />
                                {(() => {
                                    const seconds = parseInt(customerInfo.estimated_waiting_time);
                                    if (isNaN(seconds)) return customerInfo.estimated_waiting_time;
                                    
                                    if (seconds < 60) return `${seconds}s`;
                                    
                                    const h = Math.floor(seconds / 3600);
                                    const m = Math.floor((seconds % 3600) / 60);
                                    const s = seconds % 60;
                                    
                                    return [
                                        h > 0 ? `${h}h` : null,
                                        m > 0 ? `${m}m` : null,
                                        s > 0 ? `${s}s` : null
                                    ].filter(Boolean).join(" ");
                                })()}
                            </span>
                        </div>

                        {/* Position Row */}
                        <div className="flex flex-col items-center pt-2 pb-6 space-y-2 border-b border-muted/50">
                            <span className="text-muted-foreground uppercase text-[10px] tracking-widest font-black flex items-center gap-1.5">
                                <Info className="h-3 w-3" />
                                Your Position in line
                            </span>
                            <div className="relative">
                                <span className="text-7xl font-black text-primary drop-shadow-sm tabular-nums">
                                    {customerInfo.position}
                                </span>
                                <span className="absolute -top-1 -right-6 text-xl font-bold text-muted-foreground/30">
                                    #
                                </span>
                            </div>
                        </div>

                        {/* Actions Area */}
                        <div className="pt-4 flex flex-col gap-3">
                            {canCancel && (
                                <AlertDialogDestructive
                                    title="Are you absolutely sure?"
                                    description={`This will remove you from the queue. You will lose your current position (# ${customerInfo.position}) and will need to join again if you change your mind.`}
                                    onAction={() => cancelMutation.mutate()}
                                    buttonText={{cancel: "Cancel", action: "Leave Queue"}}
                                >
                                    <Button variant="outline" className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 font-bold py-6 transition-all">
                                        <Ban className="h-5 w-5" />
                                        Cancel My Position
                                    </Button>
                                </AlertDialogDestructive>
                            )}
                            
                            {customerInfo.is_paused === 1 ? (
                                <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20 text-center">
                                    <p className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                        <PauseCircle className="h-3 w-3" />
                                        Queue Paused
                                    </p>
                                    <p className="text-xs text-destructive/80 font-medium">
                                        The staff has temporarily paused this queue. Your position is safe and will resume shortly.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-center animate-pulse">
                                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider mb-1">
                                        Live Updates Enabled
                                    </p>
                                    <p className="text-xs text-primary/80">
                                        Your position will update automatically. Please keep this page open.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
