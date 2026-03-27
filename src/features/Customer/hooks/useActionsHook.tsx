import { useNotificationStore } from "@/store/useNotificationStore";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import echo from "@/lib/echo";
import { ActionPayload } from "../types";

export default function useActionsHook() {
    const { addNotification } = useNotificationStore();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    function handler(payload: ActionPayload) {
        if (payload.action === "added" || payload.action === "removed" || payload.action === "call") {
            addNotification(payload.message);
            queryClient.invalidateQueries({ queryKey: ["customer-queues"] });
        }
        if (payload.action === "served") {
            addNotification(payload.message);
            queryClient.invalidateQueries({ queryKey: ["customer-queue"] });
            queryClient.invalidateQueries({ queryKey: ["customer-queues"] });
        }
    }

    useEffect(() => {
        let channel: any;

        echo().then((echoInstance) => {
            channel = echoInstance
                .private(`action.${user?.id}`)
                .listen("SendActions", handler);
        });

        return () => {
            if (channel) {
                channel.stopListening("SendActions");
            }
        };
    }, [user]);
}
