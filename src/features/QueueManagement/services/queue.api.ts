import api from "@/lib/api";
import { CreateQueueRequest, ApiResponse, Queue, CustomerQueue} from "../types";

export const queueApi = {
    createQueue: async (data: CreateQueueRequest) => {
        const response = await api.post('/queues', data);
        return response.data;
    },
    getQueues: async (page: number = 1, perPage: number = 5) => {
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

    getCustomersQueue: async (queueId: string | number) => {
        const response = await api.get<ApiResponse<CustomerQueue[]>>(`/queues/${queueId}/users`);
        return response.data;
    }
}