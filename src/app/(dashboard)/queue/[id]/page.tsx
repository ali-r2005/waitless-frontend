'use client';
import { useParams } from 'next/navigation';

export default function QueuePage() {
  const params = useParams();
  const queueId = params.id;

  return (
    <div>
      <h1>Queue ID: {queueId}</h1>
      
    </div>
  );
}