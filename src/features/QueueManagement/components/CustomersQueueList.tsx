import { useQuery } from "@tanstack/react-query";
import { queueApi } from "../services/queue.api";

export default function CustomersQueueList({ queueId }: { queueId: string | number }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers-queue', queueId],
        queryFn: () => queueApi.getCustomersQueue(queueId),
    });
    
    const customers = data?.data;

    console.log("data of customers in the queue ", data);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.message}</div>;
    }

    return (
        <div>
            <h1>Customers Queue</h1>
            <ul className="divide-y border rounded-md">
                {customers?.map((customer) => (
                    <li key={customer.id}>
                        {customer.name} -- {customer.phone}
                    </li>
                ))}
            </ul>
        </div>
    );
}