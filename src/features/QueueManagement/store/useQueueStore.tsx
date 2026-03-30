import { create } from "zustand";
import { Queue } from "../types";

interface QueueState {
    isServing: boolean;
    setIsServing: (isServing: boolean) => void;
    queue: Queue | null;
    setQueue: (queue: Queue | null) => void;
}

const useQueueStore = create<QueueState>((set) => ({
    isServing: false,
    setIsServing: (isServing) => set({ isServing }),
    queue: null,
    setQueue: (queue) => set({ queue }),
}));

export default useQueueStore;