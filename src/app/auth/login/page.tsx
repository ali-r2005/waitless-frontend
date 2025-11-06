"use client"
import LoginForm from "@/components/auth/LoginForm"
import { Clock } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

export default function LoginPage() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  useEffect(() => {
    if (token) router.push("/dashboard");
  }, [token, router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <Clock className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Waitless</span>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
