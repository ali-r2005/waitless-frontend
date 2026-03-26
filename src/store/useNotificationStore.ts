import { create } from 'zustand';

interface NotificationState {
    notifications: string[];
    addNotification: (notification: string) => void;
    removeNotification: (notification: string) => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
    notifications: [],
    addNotification: (notification: string) => set((state) => ({
        notifications: [...state.notifications, notification],
    })),
    removeNotification: (notification: string) => set((state) => ({
        notifications: state.notifications.filter((n) => n !== notification),
    })),
    clearNotifications: () => set({ notifications: [] }),
}));