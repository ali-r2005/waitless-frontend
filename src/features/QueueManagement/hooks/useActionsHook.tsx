import { useNotificationStore } from "@/store/useNotificationStore";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import echo from "@/lib/echo";
import { ActionPayload } from "../types";
import { toast } from "sonner";

export default function useActionsHook(queueId: number) {
    // const { addNotification } = useNotificationStore();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    function handler(payload: ActionPayload) {
        if(payload.action == 'removed') {
            toast.error(payload.message);
            queryClient.invalidateQueries({ queryKey: ['customers-queue', queueId] });
        }
    }

    useEffect(() => {
        let channel: any;

        echo().then((echoInstance) => {
            channel = echoInstance
                .private(`staff.${user?.id}.actions.${queueId}`)
                .listen("StaffActionsUpdate", handler);
        });

        return () => {
            if (channel) {
                channel.stopListening("StaffActionsUpdate");
            }
        };
    }, [user]);
}
