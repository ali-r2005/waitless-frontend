import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queueApi } from "../services/queue.api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CustomersQueueTable } from "./CustomersQueueTable";
import { CustomerQueue } from "../types";

export default function CustomersQueueList({ queueId, setIsServing }: { queueId: number, setIsServing: (isServing: boolean) => void }) {
    const [activeTab, setActiveTab] = useState("waiting");
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers-queue', queueId, activeTab],
        queryFn: () => queueApi.getCustomersQueue(queueId, activeTab === "late"),
    });
    console.log("data", data);
    
    const customers: CustomerQueue[] = data?.data || [];
    const isServing = customers.some((customer) => customer.pivot.status === "serving");

    useEffect(() => {
        setIsServing(isServing);
    }, [data, setIsServing]);


    const removeMutation = useMutation({
        mutationFn: (queueUserId: number) => queueApi.removeCustomer(queueUserId),
        onSuccess: () => {
            toast.success("Customer removed from queue");
            queryClient.invalidateQueries({ queryKey: ['customers-queue', queueId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to remove customer");
        }
    });

    const reinsertMutation = useMutation({
        mutationFn: ({queueUserId, position}: {queueUserId: number, position: number}) => queueApi.reinsertCustomer(queueUserId, position),
        onSuccess: () => {
            toast.success("Customer reinserted into queue");
            queryClient.invalidateQueries({ queryKey: ['customers-queue', queueId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to reinsert customer");
        }
    });

    const markAsLateMutation = useMutation({
        mutationFn: (queueUserId: number) => queueApi.markAsLate(queueUserId),
        onSuccess: () => {
            toast.success("Customer marked as late");
            queryClient.invalidateQueries({ queryKey: ['customers-queue', queueId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to mark customer as late");
        }
    });

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="w-full">
                <CardContent className="flex justify-center items-center h-48 text-destructive flex-col gap-2">
                    <p>Failed to load customers.</p>
                    <p className="text-sm">{(error as Error)?.message}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Enqueued Customers</CardTitle>
                        <CardDescription>Live feed of everyone currently waiting or being served in this queue.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="waiting" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-4">
                        <TabsList>
                            <TabsTrigger value="waiting" className="relative">
                                Waiting List
                                {activeTab === "waiting" && customers.length > 0 && (
                                    <Badge className="ml-2 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                                        {customers.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="late" className="relative">
                                Latecomers
                                {activeTab === "late" && customers.length > 0 && (
                                    <Badge className="ml-2 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px]">
                                        {customers.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="waiting" className="mt-0">
                        <CustomersQueueTable 
                            customers={customers} 
                            activeTab={activeTab}
                            onMarkAsLate={(queueUserId) => markAsLateMutation.mutate(queueUserId)}
                            onRemove={(queueUserId) => removeMutation.mutate(queueUserId)}
                            isMarkingAsLatePending={markAsLateMutation.isPending}
                            isRemovingPending={removeMutation.isPending}
                        />
                    </TabsContent>
                    
                    <TabsContent value="late" className="mt-0">
                        <CustomersQueueTable 
                             customers={customers} 
                             activeTab={activeTab}
                             positions={data?.positions}
                             onMarkAsLate={(queueUserId) => markAsLateMutation.mutate(queueUserId)}
                             onRemove={(queueUserId) => removeMutation.mutate(queueUserId)}
                             isMarkingAsLatePending={markAsLateMutation.isPending}
                             isRemovingPending={removeMutation.isPending}
                             onReinsert={(queueUserId, position) => reinsertMutation.mutate({queueUserId, position})}
                             isReinsertingPending={reinsertMutation.isPending}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}