import type { Metadata } from "next";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Waitless account for your business and start managing your queues efficiently today.",
};

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <RegisterForm />
      </div>
    </div>
  );
}

