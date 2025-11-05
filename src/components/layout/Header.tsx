"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ModeToggle from "@/components/shared/mode-toggle"
import { Clock } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Waitless</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="#features" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="#pricing" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link 
            href="#contact" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
