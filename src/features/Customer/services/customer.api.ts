import api from "@/lib/api";

const customerApi = {
    getQueues: async () => {
        const response = await api.get('/customer/queues');
        return response.data;
    },

    getQueueCustomerById: async (id: number) => {
        const response = await api.get(`/customer/queue-users/${id}`);
        return response.data;
    }
}

export default customerApi;