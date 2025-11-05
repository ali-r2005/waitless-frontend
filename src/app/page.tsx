import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Clock, 
  Users, 
  BarChart3, 
  Bell, 
  Shield, 
  Zap,
  ArrowRight,
  Building2,
  Stethoscope,
  Store
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-20 md:py-32">
        <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
            Eliminate Wait Times,
            <br />
            <span className="text-primary">Enhance Customer Experience</span>
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Modern queue management system designed for hospitals, clinics, and service centers. 
            Streamline operations and keep your customers informed in real-time.
          </p>
          <div className="flex gap-4 mt-4">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20 md:py-24 bg-muted/50">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-12">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
            Everything You Need to Manage Queues
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground">
            Powerful features designed to optimize your workflow and improve customer satisfaction
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Real-Time Updates</CardTitle>
              <CardDescription>
                Keep customers informed with live queue status and estimated wait times
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Smart Queue Management</CardTitle>
              <CardDescription>
                Efficiently organize and prioritize customers based on service type and urgency
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-10 w-10 text-primary mb-2" />
              <CardTitle>SMS & Push Notifications</CardTitle>
              <CardDescription>
                Automatic alerts when it&apos;s almost time for customer&apos;s turn
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track performance metrics and optimize your service delivery
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security with 99.9% uptime guarantee
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Quick setup with existing systems and workflows
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container py-20 md:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-12">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
            Built for Every Industry
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground">
            Trusted by businesses across multiple sectors
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Healthcare</CardTitle>
              <CardDescription>
                Hospitals, clinics, and medical centers managing patient flow efficiently
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Government Services</CardTitle>
              <CardDescription>
                Public offices and service centers streamlining citizen services
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Retail & Services</CardTitle>
              <CardDescription>
                Banks, retail stores, and service providers enhancing customer experience
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container py-20 md:py-24 bg-muted/50">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center mb-12">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
            How It Works
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Sign Up</h3>
            <p className="text-muted-foreground">
              Create your account and set up your business profile in minutes
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Configure Queues</h3>
            <p className="text-muted-foreground">
              Set up your service types, staff, and queue preferences
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Start Managing</h3>
            <p className="text-muted-foreground">
              Begin accepting customers and watch your efficiency soar
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-24">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="text-center space-y-4 pb-8">
            <CardTitle className="text-3xl md:text-4xl">
              Ready to Transform Your Queue Management?
            </CardTitle>
            <CardDescription className="text-lg">
              Join hundreds of businesses already using Waitless to improve their operations
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">Contact Sales</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
