import api from "@/lib/api";

const customerApi = {
    getQueues: async () => {
        const response = await api.get('/customer/queues');
        return response.data;
    },

    getQueueCustomerById: async (id: number) => {
        const response = await api.get(`/customer/queue-users/${id}`);
        return response.data;
    },

    cancelQueue: async (id: number) => {
        const response = await api.put(`/customer/queue-users/${id}/cancel`);
        return response.data;
    },

    removeQueue: async (id: number) => {
        const response = await api.delete(`/customer/queue-users/${id}`);
        return response.data;
    }
}

export default customerApi;