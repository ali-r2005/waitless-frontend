import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, UserMinus, Clock, MoreHorizontal } from "lucide-react";
import { AlertDialogDestructive } from "@/components/shared/destructive-confirm";
import { CustomerQueue } from "../types";

interface CustomersQueueTableProps {
    customers: CustomerQueue[];
    activeTab: string;
    onMarkAsLate: (userId: number) => void;
    onRemove: (userId: number) => void;
    isMarkingAsLatePending: boolean;
    isRemovingPending: boolean;
}

export const CustomersQueueTable = ({
    customers,
    activeTab,
    onMarkAsLate,
    onRemove,
    isMarkingAsLatePending,
    isRemovingPending
}: CustomersQueueTableProps) => {

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

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[120px] font-semibold">Ticket No.</TableHead>
                        <TableHead className="font-semibold">Position</TableHead>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Contact</TableHead>
                        <TableHead className="font-semibold text-right">Status</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                {activeTab === "late" ? "No latecomers found." : "No customers are currently waiting."}
                            </TableCell>
                        </TableRow>
                    ) : (
                        customers.map((customer) => (
                            <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium text-primary">
                                    #{customer.pivot.ticket_number}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {customer.pivot.position || 'N/A'}
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
                                <TableCell className="text-right">
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                
                                                {customer.pivot.status !== 'late' && customer.pivot.status !== 'served' && customer.pivot.status !== 'cancelled' && (
                                                    <DropdownMenuItem 
                                                        onClick={() => onMarkAsLate(customer.pivot.id)}
                                                        disabled={isMarkingAsLatePending}
                                                        className="text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-900/20"
                                                    >
                                                        {isMarkingAsLatePending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                                                        <span>Mark as Late</span>
                                                    </DropdownMenuItem>
                                                )}

                                                <AlertDialogDestructive
                                                    title="Remove Customer"
                                                    description={`Are you sure you want to remove ${customer.name} from the queue? This action cannot be undone.`}
                                                    onAction={() => onRemove(customer.pivot.id)}
                                                >
                                                    <DropdownMenuItem 
                                                        onSelect={(e) => e.preventDefault()}
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                        disabled={isRemovingPending}
                                                    >
                                                        {isRemovingPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserMinus className="mr-2 h-4 w-4" />}
                                                        <span>Remove from Queue</span>
                                                    </DropdownMenuItem>
                                                </AlertDialogDestructive>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
