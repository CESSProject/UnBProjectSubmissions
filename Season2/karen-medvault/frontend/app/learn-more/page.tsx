"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Lock,
  Zap,
  Users,
  Database,
  ShieldCheck,
  Cpu,
  Heart,
  Shield,
  TrendingUp,
} from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export default function LearnMore() {
  const features = [
    {
      icon: Lock,
      title: "Proxy Re-Encryption",
      description:
        "Advanced cryptographic technique allowing data owners to delegate decryption rights without revealing keys.",
    },
    {
      icon: Zap,
      title: "Smart Contract Access Control",
      description:
        "Ethereum smart contracts manage permissions with complete transparency and automatic expiration.",
    },
    {
      icon: Users,
      title: "Granular Permissions",
      description:
        "MDRC enables fine-grained access control with time-based restrictions for healthcare providers.",
    },
    {
      icon: Database,
      title: "DeOSS Decentralized Storage",
      description:
        "CESS DeOSS removes single points of failure and ensures redundancy with PoDR² cryptographic validation.",
    },
    {
      icon: Shield,
      title: "Proof of Data Existence",
      description:
        "PoE stores immutable file hashes on blockchain to prove authenticity and timestamp.",
    },
    {
      icon: Cpu,
      title: "AI-LINK Integration",
      description:
        "AI-LINK enables intelligent medical data processing with full privacy preservation.",
    },
  ]

  const faqs = [
    {
      question: "Why is medical data so valuable?",
      answer:
        "Medical records are 20x more valuable than financial data. They contain personal, insurance, and medical history information—ideal for criminal misuse.",
    },
    {
      question: "How does MedVault prove file authenticity?",
      answer:
        "MedVault uses PoE to record file hashes on Ethereum. This creates immutable proof of existence and content integrity.",
    },
    {
      question: "Can I revoke access after granting it?",
      answer:
        "Yes. All access is blockchain-enforced. Revocation is instant and irreversible.",
    },
    {
      question: "What is PoDR² and why does it matter?",
      answer:
        "PoDR² proves that your files are safely replicated and recoverable across CESS nodes, even if nodes fail.",
    },
    {
      question: "How is my data protected during transfer?",
      answer:
        "Files are hashed locally and encrypted before uploading. MedVault never sees raw files.",
    },
    {
      question: "Is MedVault HIPAA and GDPR compliant?",
      answer:
        "MedVault follows key compliance principles, but healthcare organizations should verify region-specific regulations.",
    },
  ]

  const cessIntegration = [
    { name: "DeOSS", desc: "Decentralized Object Storage System", icon: Database },
    { name: "PoDR²", desc: "Reduplication & Recovery Verification", icon: Shield },
    { name: "Proxy Re-Encryption", desc: "Delegate Decryption Safely", icon: Lock },
    { name: "PoE", desc: "Proof of Data Existence", icon: Zap },
    { name: "MDRC", desc: "Granular Access Rights", icon: Users },
    { name: "AI-LINK", desc: "Privacy-Preserving AI Processing", icon: Cpu },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/20">
      {/* --------------------------- NAVBAR IDÊNTICA À HOME --------------------------- */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">MedVault</span>
            </Link>

            {/* Central Links */}
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

            {/* Right Section */}
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

              <MobileNav currentPath="/learn-more" />
            </div>
          </div>
        </div>
      </nav>
      {/* ------------------------- FIM NAVBAR IGUAL À HOME ------------------------- */}

      {/* Hero Section */}
      <section className="animate-fade-in mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="space-y-6 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            The Future of Medical Data Security
          </h1>
          <p className="mx-auto max-w-2xl leading-relaxed text-lg text-muted-foreground">
            MedVault demonstrates how CESS Network enables decentralized
            healthcare infrastructure with unmatched security.
          </p>
        </div>
      </section>

      {/* Medical Data Value */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold md:text-4xl">
              Why Medical Data Matters
            </h2>
            <p className="leading-relaxed text-lg text-muted-foreground">
              Medical records are{" "}
              <span className="font-semibold text-accent">
                20x more valuable
              </span>{" "}
              than financial data. Centralized systems expose millions of files
              to breaches.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Heart className="mt-1 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Massive Attack Surface</h3>
                  <p className="text-sm text-muted-foreground">
                    Hospitals and clinics act as single points of failure.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <TrendingUp className="mt-1 h-6 w-6 text-accent" />
                <div>
                  <h3 className="font-semibold">High-Value Targets</h3>
                  <p className="text-sm text-muted-foreground">
                    Stolen medical records sell for $1,000+ each.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="mt-1 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">CESS Solves This</h3>
                  <p className="text-sm text-muted-foreground">
                    Decentralized, cryptographic infrastructure eliminates weak
                    points.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative flex h-80 flex-col justify-center rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 to-accent/5 p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Medical Data Value</span>
                  <span className="text-accent">20x</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-card">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
                <p className="text-xs text-muted-foreground">
                  vs Financial Data
                </p>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Average dark market price:{" "}
                  <span className="font-semibold text-accent">$1,000+</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Major breach value:{" "}
                  <span className="font-semibold text-accent">
                    $50M - $200M+
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">
          How CESS Technology Powers MedVault
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/30 p-6 transition-all hover:border-accent/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CESS Integration */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Complete CESS Network Integration
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              MedVault showcases every major CESS technology for secure
              healthcare data infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {cessIntegration.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  className="group rounded-lg border border-border/50 p-5 transition-all hover:border-accent/50 hover:bg-card/50"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <div>
                      <h3 className="text-sm font-semibold">{feat.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group cursor-pointer rounded-lg border border-border/50 p-6 transition-colors hover:border-accent/30"
            >
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold">
                {faq.question}
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="relative rounded-2xl border border-accent/40 bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center md:p-12">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            See MedVault in Action
          </h2>
          <p className="mb-8 mx-auto max-w-2xl text-lg text-muted-foreground">
            Experience how decentralized medical data infrastructure transforms
            healthcare.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/get-started">
              <Button size="lg" className="animate-glow-pulse gap-2">
                Get Started <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                Dashboard <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
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
                Demonstrating CESS Network for decentralized healthcare
                infrastructure
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Resources</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  href="/learn-more"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Learn More
                </Link>
                <Link
                  href="/get-started"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Get Started
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Technology</h4>
              <nav className="flex flex-col space-y-2 text-sm">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  CESS Network
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  CESS testnet
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </a>
              </nav>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Status</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span>Network Active</span>
                </div>
                <p className="text-xs">CESS Testnet</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                © 2025 MedVault — A case study powered by CESS Network.
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
