"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect , useState } from "react";
import echo from "@/lib/echo";

export default function CustomerComponent() {
    const [customerInfo, setCustomerInfo] = useState({
        status: "N/A",
        ticketNumber: "N/A",
        position: "N/A",
        estimatedTime: "N/A",
    });

    const { user } = useAuthStore();
    console.log(user)
    console.log('i will us the id to listen to the update of the authenticated user in the specific channel update.id update.',user?.id);

    const handler = (data: any) => {
        console.log('data from the update channel', data);
    }

    useEffect(
        () => {
            if (!user?.id) return;
            echo().then((echoInstance) => {
                console.log('echoInstance', echoInstance);
                echoInstance.private(`update.${user?.id}`).listen('SendUpdate', handler);
            });
        }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Page title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Customer Overview
                </h1>

                {/* Info card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 transition-shadow hover:shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-600 font-medium">Name</span>
                        <span className="text-gray-900 font-mono text-lg">
                            {user?.name}
                        </span>
                    </div>
                    {/* Status */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-600 font-medium">Status</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            {customerInfo.status}
                        </span>
                    </div>

                    {/* Ticket number */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-600 font-medium">Ticket number</span>
                        <span className="text-gray-900 font-mono text-lg">
                            {customerInfo.ticketNumber}
                        </span>
                    </div>

                    {/* Position */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-600 font-medium">Position</span>
                        <span className="text-2xl font-bold text-indigo-600">
                            {customerInfo.position}
                        </span>
                    </div>

                    {/* Estimated time */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Estimated time</span>
                        <span className="text-gray-900 font-semibold">
                            {customerInfo.estimatedTime}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
