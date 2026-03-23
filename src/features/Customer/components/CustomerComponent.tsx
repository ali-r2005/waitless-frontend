"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import echo from "@/lib/echo";
import { CustomerUpdate } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import customerApi from "../services/customer.api";

export default function CustomerComponent({ CustomerQueueId }: { CustomerQueueId: number }) {

    const { data , isLoading, isError } = useQuery({
        queryKey: ["customer-queue", CustomerQueueId],
        queryFn: () => customerApi.getQueueCustomerById(CustomerQueueId),
    });

    const { user } = useAuthStore();

    const queueId = data?.queue_id;
    console.log('customer info',data);
    const [customerInfo, setCustomerInfo] = useState<CustomerUpdate>({
        type: "N/A",
        receiver_id: data?.user_id || user?.id || 0,
        queue_id: data?.queue_id || 0,
        queue_name: data?.queue?.name || "N/A",
        ticket_number: data?.ticket_number || "N/A",
        position: data?.position || 0,
        status: data?.status || "N/A",
    });

    const handler = (data: { update: CustomerUpdate }) => {
        setCustomerInfo(data.update);
    }

    useEffect(
        () => {
            if (!user?.id) return;
            echo().then((echoInstance) => {
                echoInstance.private(`update.${user?.id}.queue.${queueId}`).listen('SendUpdate', handler);
            });
        }, [user]);

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "serving":
                return "default";
            case "waiting":
                return "secondary";
            case "late":
                return "destructive";
            default:
                return "outline";
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">
                <h1 className="text-3xl font-bold tracking-tight text-center">
                    Customer Overview
                </h1>

                <Card className="shadow-lg border-none">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold text-primary">
                            {customerInfo.queue_name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between border-b pb-3 border-muted/50">
                            <span className="text-muted-foreground font-medium">Name</span>
                            <span className="text-foreground font-semibold">
                                {user?.name}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-b pb-3 border-muted/50">
                            <span className="text-muted-foreground font-medium">Status</span>
                            <Badge variant={getStatusVariant(customerInfo.status)} className="capitalize">
                                {customerInfo.status}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between border-b pb-3 border-muted/50">
                            <span className="text-muted-foreground font-medium">Ticket Number</span>
                            <span className="text-foreground font-mono text-lg font-bold">
                                {customerInfo.ticket_number}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-medium">Position</span>
                            <span className="text-3xl font-bold text-primary">
                                {customerInfo.position}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
