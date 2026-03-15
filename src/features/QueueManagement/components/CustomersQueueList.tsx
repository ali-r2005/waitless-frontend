import { useQuery } from "@tanstack/react-query";
import { queueApi } from "../services/queue.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function CustomersQueueList({ queueId }: { queueId: string | number }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers-queue', queueId],
        queryFn: () => queueApi.getCustomersQueue(queueId),
    });
    
    const customers = data?.data || [];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'waiting':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300';
            case 'serving':
                return 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300';
            case 'served':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-300';
            case 'late':
                return 'bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
        }
    };

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
                <CardTitle className="text-xl">Enqueued Customers</CardTitle>
                <CardDescription>Live feed of everyone currently waiting or being served in this queue.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[120px] font-semibold">Ticket No.</TableHead>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold hidden md:table-cell">Contact</TableHead>
                                <TableHead className="font-semibold text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        No customers are currently in this queue.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium text-primary">
                                            #{customer.pivot.ticket_number}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{customer.name}</div>
                                            <div className="text-xs text-muted-foreground md:hidden">{customer.phone}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {customer.phone || "No phone"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge 
                                              variant="secondary" 
                                              className={`capitalize px-3 py-1 ${getStatusColor(customer.pivot.status)}`}
                                            >
                                                {customer.pivot.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}