import Link from "next/link"
import { ArrowRight, Sparkles, Zap, Shield, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Design",
      description: "Generate stunning layouts with intelligent suggestions and automated enhancements",
      gradient: "gradient-primary",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Create and export professional creatives in minutes, not hours",
      gradient: "gradient-accent",
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description: "Auto-check retailer guidelines and fix violations instantly",
      gradient: "from-chart-3 to-chart-5",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time feedback, version control, and seamless team workflows",
      gradient: "from-chart-2 to-chart-1",
    },
  ]

  const stats = [
    { value: "10x", label: "Faster Production" },
    { value: "99%", label: "Compliance Rate" },
    { value: "30+", label: "Export Formats" },
    { value: "24/7", label: "AI Assistant" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl gradient-primary shadow-2xl">
                <Sparkles className="h-9 w-9 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="block bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
                ReTailor AI
              </span>
            </h1>
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">AI-Powered Creative Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-balance mt-6 sm:mt-8">
              Create Retail Media
              <span className="block text-primary mt-2">10x Faster</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground text-balance px-4 sm:px-0">
              Combine intelligent automation with professional design tools to create stunning, compliant retail media
              in minutes.
            </p>
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 gradient-primary text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/templates" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base sm:text-lg px-6 sm:px-8 bg-transparent w-full sm:w-auto"
                >
                  View Templates
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-10 sm:mt-12 md:mt-16 relative px-4 sm:px-0">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img
              src="/creative-workspace.jpg"
              alt="ReTailor AI Workspace"
              className="mx-auto rounded-lg sm:rounded-xl border border-border shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Everything You Need</h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
              Professional tools powered by AI to streamline your creative workflow
            </p>
          </div>

          <div className="mt-10 sm:mt-12 md:mt-16 grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-transparent hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div
                    className={`mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg ${feature.gradient}`}
                  >
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="border-y border-border bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold">Smart AI Enhancement</h3>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
                Automatically enhance product images with AI-powered color correction, lighting adjustments, and smart
                cropping for every platform.
              </p>
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {["Auto white balance", "Shadow/highlight recovery", "Smart sharpening", "Multi-channel resize"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success flex-shrink-0" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/enhance" className="mt-4 sm:mt-6 w-full sm:w-fit">
                <Button className="w-full sm:w-auto gradient-accent">
                  Explore Enhancement Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative order-first lg:order-last">
              <img
                src="/ai-technology.jpg"
                alt="AI Enhancement"
                className="rounded-lg sm:rounded-xl border border-border shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <div className="relative">
              <img
                src="/team-collaboration.jpg"
                alt="Team Collaboration"
                className="rounded-lg sm:rounded-xl border border-border shadow-xl"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold">Seamless Team Collaboration</h3>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
                Work together in real-time with inline comments, version control, and approval workflows that keep
                everyone aligned.
              </p>
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {["Real-time co-editing", "Inline feedback & annotations", "Version history", "Approval workflows"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success flex-shrink-0" />
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/collaboration" className="mt-4 sm:mt-6 w-full sm:w-fit">
                <Button className="w-full sm:w-auto gradient-primary">
                  Learn About Collaboration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y border-border bg-gradient-to-br from-primary/10 via-accent/10 to-chart-3/10 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Transform Your Workflow?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
              Join thousands of brands creating better retail media, faster.
            </p>
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 gradient-primary text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  Start Creating Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
                  ReTailor AI
                </span>
                <span className="block text-xs text-muted-foreground">Creative Studio</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © 2025 ReTailor AI. Professional retail media at scale.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
