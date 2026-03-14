'use client';
import { useParams } from 'next/navigation';
import CustomersQueueList from '@/features/QueueManagement/components/CustomersQueueList';

export default function QueuePage() {
  const params = useParams();
  const queueId = params.id;

  return (
    <div>
      <CustomersQueueList queueId={queueId as string} />
    </div>
  );
}