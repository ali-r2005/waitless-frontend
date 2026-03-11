import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, OctagonAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8 px-4 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl animate-pulse"></div>
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-background border shadow-2xl">
          <OctagonAlert className="h-16 w-16 text-primary" />
        </div>
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground text-lg">
          Oops! The page you're looking for doesn't exist or has been moved to a different queue.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="px-8 shadow-lg shadow-primary/20">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="px-8">
          <Link href="/auth/login">
            Sign In
          </Link>
        </Button>
      </div>

      <div className="pt-12">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/50">
          Waitless v1.0 • System Status: Operational
        </div>
      </div>
    </div>
  );
}
