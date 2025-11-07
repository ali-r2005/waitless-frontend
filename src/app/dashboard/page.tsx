"use client"
import { logout } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/hooks/auth/useRequireAuth"

export default function Dashboard() {
    useRequireAuth()
    return (
        <div>
            <h1>Dashboard</h1>
            <Button onClick={logout}>Logout</Button>
        </div>
    )
}