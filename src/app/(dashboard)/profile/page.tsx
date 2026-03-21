"use client";
import Profile from "@/features/auth/components/ShowProfile";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
    const { isAuthenticated } = useAuthStore();

    console.log('isAuthenticated', isAuthenticated);

    return (
        <>
        <Profile />
        {isAuthenticated && <p>the user is authenticated</p>}
        </>
    );
}