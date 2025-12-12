"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck,
  Lock,
  Database,
  ChevronRight,
  Zap,
  Heart,
  Shield,
  Cpu,
} from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export default function Home() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Medical Grade Security",
      description:
        "Your files protected by blockchain PoE and Proxy Re-Encryption, auditable and tamper-proof",
    },
    {
      icon: Lock,
      title: "Granular Access Control",
      description:
        "Grant temporary access with automatic expiration via smart contracts and MDRC verification",
    },
    {
      icon: Database,
      title: "Decentralized Storage",
      description:
        "CESS DeOSS provides cryptographically secure, redundant storage with PoDR² validation",
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description:
        "Smart contracts verify ownership through PoE and manage permissions with transparency",
    },
  ]

  const cessFeatures = [
    { name: "DeOSS", desc: "Decentralized Object Storage System" },
    { name: "PoDR²", desc: "Proof of Data Reduplication & Recovery" },
    { name: "Proxy Re-Encryption", desc: "Cryptographic Access Delegation" },
    { name: "PoE", desc: "Proof of Existence on Blockchain" },
    { name: "MDRC", desc: "Multi-format Data Rights Confirmation" },
    { name: "AI-LINK", desc: "Intelligent Data Processing" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">MedVault</span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/learn-more"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Learn More
              </Link>
              <Link
                href="/get-started"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Get Started
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-3 py-1.5 sm:flex">
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                <span className="text-xs font-medium text-slate-400">
                  Testnet Active
                </span>
              </div>

              <Link href="/dashboard" className="hidden sm:block">
                <Button className="gap-2">
                  Dashboard <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              {/* Mobile Navigation Menu */}
              <MobileNav currentPath="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="animate-fade-in mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Powered by CESS Network
              </span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Medical Data Security Redefined with
              <span className="text-primary"> Decentralized Storage</span>
            </h1>

            <p className="max-w-md leading-relaxed text-lg text-muted-foreground">
              MedVault demonstrates the power of CESS Network for healthcare.
              Patients control medical records with blockchain-verified access,
              cryptographic storage, and transparent data governance. This is the
              future of medical data infrastructure.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link href="/get-started">
                <Button size="lg" className="animate-glow-pulse gap-2">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learn-more">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl border border-border bg-card/50 p-8 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
            <div className="relative flex h-full w-full flex-col gap-4">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between px-2">
                <div className="h-6 w-40 animate-pulse rounded-lg bg-primary/30" />
                <div className="flex gap-1">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-accent/30" />
                  <div
                    className="h-5 w-5 animate-pulse rounded-full bg-primary/30"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="h-5 w-5 animate-pulse rounded-full bg-accent/30"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>

              {/* File Storage Cards - 3x3 Grid */}
              <div className="grid flex-1 grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex animate-pulse flex-col gap-1.5 rounded-lg border border-accent/40 bg-card p-2 transition-colors hover:border-primary/60"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="h-4 w-4 rounded bg-primary/50" />
                    <div className="h-2 w-full rounded bg-accent/20" />
                    <div className="h-2 w-3/4 rounded bg-accent/20" />
                  </div>
                ))}
              </div>

              {/* Metrics Row */}
              <div className="mt-auto grid grid-cols-3 gap-2">
                <div className="animate-pulse rounded-lg border border-primary/30 bg-primary/10 p-2 text-center">
                  <div className="mb-1 mx-auto h-3 w-8 rounded bg-primary/40" />
                  <div className="mx-auto h-2 w-12 rounded bg-primary/20 text-xs" />
                </div>
                <div
                  className="animate-pulse rounded-lg border border-accent/30 bg-accent/10 p-2 text-center"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="mb-1 mx-auto h-3 w-8 rounded bg-accent/40" />
                  <div className="mx-auto h-2 w-12 rounded bg-accent/20 text-xs" />
                </div>
                <div
                  className="animate-pulse rounded-lg border border-primary/30 bg-primary/10 p-2 text-center"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="mb-1 mx-auto h-3 w-8 rounded bg-primary/40" />
                  <div className="mx-auto h-2 w-12 rounded bg-primary/20 text-xs" />
                </div>
              </div>

              {/* Access Status Badges */}
              <div className="flex gap-2">
                <div className="flex-1 text-primary animate-pulse flex h-7 items-center justify-center rounded-full border border-primary/50 bg-gradient-to-r from-primary/20 to-primary/10 text-xs font-semibold">
                  ✓ 3 Access Granted
                </div>
                <div
                  className="flex-1 text-accent animate-pulse flex h-7 items-center justify-center rounded-full border border-accent/50 bg-gradient-to-r from-accent/20 to-accent/10 text-xs font-semibold"
                  style={{ animationDelay: "0.3s" }}
                >
                  ⏳ 1 Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold md:text-4xl">
              Why Medical Data Matters
            </h2>
            <p className="leading-relaxed text-lg text-muted-foreground">
              Medical records são
              <span className="font-semibold text-accent">
                20x more valuable than financial data
              </span>{" "}
              to bad actors. Traditional centralized systems are prime targets
              for healthcare breaches—exposing millions of records worth
              billions on the dark web.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Heart className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Patient Privacy at Risk</h3>
                  <p className="text-sm text-muted-foreground">
                    Centralized databases are single points of failure
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">CESS Solves This</h3>
                  <p className="text-sm text-muted-foreground">
                    Decentralized, cryptographically secured data infrastructure
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex h-80 flex-col justify-center rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 to-accent/5 p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Data Value at Risk
                </span>
                <span className="font-bold text-primary">20x</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-card">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
              <p className="text-xs text-muted-foreground">
                Medical data is 20x more valuable than financial data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold">Why MedVault?</h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Purpose-built for healthcare using CESS Network infrastructure to
            demonstrate enterprise-grade decentralized data management.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg border border-border bg-card/30 p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Powered by CESS Network
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              MedVault integrates CESS's cutting-edge infrastructure to provide
              unmatched security, transparency, and patient control over medical
              data.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {cessFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="group rounded-lg border border-border/50 p-4 transition-all hover:border-accent/50 hover:bg-card/40"
              >
                <div className="flex items-start gap-3">
                  <Cpu className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold">{feat.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="relative rounded-2xl border border-card bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center md:p-12">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            See MedVault in Action
          </h2>
          <p className="mb-8 mx-auto max-w-2xl text-lg text-muted-foreground">
            Experience how CESS Network transforms medical data storage and
            access control for the modern healthcare ecosystem.
          </p>
          <Link href="/get-started">
            <Button size="lg" className="animate-glow-pulse gap-2">
              Start Exploring <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-border bg-card/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-semibold">MedVault</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Decentralized medical data vault powered by CESS Network
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Product</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link
                  href="/"
                  className="transition-colors hover:text-foreground text-muted-foreground"
                >
                  Home
                </Link>
                <Link
                  href="/learn-more"
                  className="transition-colors hover:text-foreground text-muted-foreground"
                >
                  Learn More
                </Link>
                <Link
                  href="/get-started"
                  className="transition-colors hover:text-foreground text-muted-foreground"
                >
                  Get Started
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Resources</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <a
                  href="#"
                  className="transition-colors hover:text-foreground text-muted-foreground"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="transition-colors hover:text-foreground text-muted-foreground"
                >
                  CESS Network
                </a>
                <a
                  href="#"
                  className="transition-colors hover:text-foreground text-muted-foreground"
                >
                  Contact
                </a>
              </nav>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Testnet</h4>
              <p className="text-sm text-muted-foreground">
                Running on CESS Network Testnet
              </p>
              <p className="text-xs text-accent">Network Status: Active</p>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                © 2025 MedVault. A case study demonstrating CESS Network
                capabilities.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Powered by CESS Network
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
