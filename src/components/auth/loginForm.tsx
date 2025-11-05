"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loginSchema, LoginInput } from "@/types/auth"
import { useLogin } from "@/hooks/auth/useLogin"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const { mutate: login, isPending } = useLogin()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        toast.success("Login successful!")
        router.push("/dashboard")
      },
      onError: (error: Error) => {
        const errorMessages = error.message || "Login failed. Please try again."
        toast.error(errorMessages)
      },
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
