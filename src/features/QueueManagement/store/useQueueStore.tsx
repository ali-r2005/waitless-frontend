import { create } from "zustand";
import { Queue } from "../types";

interface QueueState {
    isServing: boolean;
    setIsServing: (isServing: boolean) => void;
    hasCustomers: boolean;
    setHasCustomers: (hasCustomers: boolean) => void;
    queue: Queue | null;
    setQueue: (queue: Queue | null) => void;
}

const useQueueStore = create<QueueState>((set) => ({
    isServing: false,
    setIsServing: (isServing) => set({ isServing }),
    hasCustomers: false,
    setHasCustomers: (hasCustomers) => set({ hasCustomers }),
    queue: null,
    setQueue: (queue) => set({ queue }),
}));

export default useQueueStore;