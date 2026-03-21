import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global { interface Window { Pusher: typeof Pusher } }

export default async function echo(): Promise<Echo<any>> {
    window.Pusher = Pusher;

    const token = localStorage.getItem('token');

    const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    forceTLS: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/broadcasting/auth`,
    auth: {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    },
    });
    
    return echo;
}