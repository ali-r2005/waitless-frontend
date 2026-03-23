import api from "@/lib/api";

const customerApi = {
    getQueues: async () => {
        const response = await api.get('/customer/queues');
        return response.data;
    }
}

export default customerApi;