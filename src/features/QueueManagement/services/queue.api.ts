import api from "@/lib/api";
import { CreateQueueRequest, ApiResponse, Queue, CustomerQueue} from "../types";

export const queueApi = {
    createQueue: async (data: CreateQueueRequest) => {
        const response = await api.post('/queues', data);
        return response.data;
    },
    getQueues: async (page: number = 1, perPage: number = 10) => {
        const response = await api.get<ApiResponse<Queue[]>>(`/queues?page=${page}&per_page=${perPage}`);
        return response.data;
    },
    getQueueById: async (id: number) => {
        const response = await api.get<ApiResponse<Queue>>(`/queues/${id}`);
        return response.data;
    },
    updateQueue: async (id: number, data: CreateQueueRequest) => {
        const response = await api.put(`/queues/${id}`, data);
        return response.data;
    },
    deleteQueue: async (id: number) => {
        const response = await api.delete(`/queues/${id}`);
        return response.data;
    },

    getCustomersQueue: async (queueId: string | number, isLate: boolean = false) => {
        const response = await api.get<ApiResponse<CustomerQueue[]>>(`/queues/${queueId}/users`, ...(isLate ? [{params: {status : 'late'}}] : []));
        return response.data;
    },

    removeCustomer: async (queueUserId: number) => {
        const response = await api.delete(`/queues/queue-users/${queueUserId}`);
        return response.data;
    },

    markAsLate: async (queueUserId: number) => {
        const response = await api.put(`/queues/queue-users/${queueUserId}/mark-late`);
        return response.data;
    },

    addCustomerToQueue: async (queueId: number, userId: number) => {
        const response = await api.post(`/queues/${queueId}/users/${userId}`);
        return response.data;
    },

    callNextCustomer: async (queueId: number) => {
        const response = await api.put(`/queues/${queueId}/call-next`);
        return response.data;
    },

    completeServing: async (queueId: number) => {
        const response = await api.put(`/queues/${queueId}/complete-serving`);
        return response.data;
    },

    reinsertCustomer: async (queueUserId: number, position: number) => {
        const response = await api.put(`/queues/queue-users/${queueUserId}/reinsert`, {position});
        return response.data;
    },

    activateQueue: async (queueId: number) => {
        const response = await api.put(`/queues/${queueId}/activate`);
        return response.data;
    },

    deactivateQueue: async (queueId: number) => {
        const response = await api.put(`/queues/${queueId}/deactivate`);
        return response.data;
    },

    pauseQueue: async (queueId: number) => {
        const response = await api.put(`/queues/${queueId}/pause`);
        return response.data;
    },

    resumeQueue: async (queueId: number) => {
        const response = await api.put(`/queues/${queueId}/resume`);
        return response.data;
    }
}