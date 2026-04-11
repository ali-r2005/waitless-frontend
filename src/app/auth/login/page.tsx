import type { Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Waitless account to manage your business queues and staff transitions.",
};

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <LoginForm />
      </div>
    </div>
  );
}

