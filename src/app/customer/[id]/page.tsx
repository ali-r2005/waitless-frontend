"use client";
import { useParams } from "next/navigation";
import CustomerComponent from "@/features/Customer/components/CustomerComponent";
import { Suspense } from "react";

export default function CustomerQueuePage() {
    const params = useParams();
    const queueId = params.id as string;
    return (
        <div>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <CustomerComponent CustomerQueueId={parseInt(queueId)} />
            </Suspense>
        </div>
    );
}