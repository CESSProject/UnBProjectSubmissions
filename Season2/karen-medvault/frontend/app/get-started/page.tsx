"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Wallet, Upload, ShieldCheck, Lock, Zap, CheckCircle } from "lucide-react"
import { useWeb3 } from "@/lib/web3-provider"
import { MobileNav } from "@/components/mobile-nav"
import { useState } from "react"

export default function GetStarted() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { connect, isConnected } = useWeb3()

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description:
        "Link your MetaMask wallet to authenticate on the CESS testnet. MedVault uses CESS Network's secure infrastructure.",
      details: "Ensure MetaMask is installed and configured for CESS.",
    },
    {
      icon: Upload,
      title: "Upload Medical Files",
      description:
        "Select medical documents for secure storage. Files are encrypted locally and stored on CESS DeOSS.",
      details: "Your files remain private and verifiable.",
    },
    {
      icon: Lock,
      title: "Grant Temporary Access",
      description:
        "Share records with healthcare providers through blockchain access tokens that expire automatically.",
      details: "Revoke access instantly.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/20">

      {/* ---------------- NAVBAR IDÊNTICA À HOME ---------------- */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">MedVault</span>
            </Link>

            {/* Links centrais */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
              <Link href="/learn-more" className="text-sm font-medium hover:text-primary transition-colors">Learn More</Link>
              <Link href="/get-started" className="text-sm font-medium hover:text-primary transition-colors">Get Started</Link>
            </div>

            {/* Status + Dashboard + Mobile */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-accent/40 rounded-full bg-accent/5">
                <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs font-medium text-slate-400">Testnet Active</span>
              </div>

              <Link href="/dashboard" className="hidden sm:block">
                <Button className="gap-2">
                  Dashboard <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <MobileNav currentPath="/get-started" />
            </div>

          </div>
        </div>
      </nav>
      {/* ---------------- FIM NAVBAR ---------------- */}

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-fade-in">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Powered by CESS Network
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Get Started with <span className="text-primary">MedVault</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Take control of your medical records with blockchain-secured, decentralized storage and transparent access control.
          </p>
        </div>
      </section>

      {/* Quick Action */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/20 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Secure Your Medical Records?</h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect your wallet and start uploading files securely with full blockchain verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className={`gap-2 ${isConnected ? "bg-green-600 hover:bg-green-700" : "animate-glow-pulse"}`}
              onClick={handleConnectWallet}
              disabled={isConnecting || isConnected}
            >
              <Wallet className="h-5 w-5" />
              {isConnecting ? "Connecting..." : isConnected ? "✓ Wallet Connected" : "Connect Your Wallet"}
            </Button>

            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto bg-background/50">
                <Upload className="h-5 w-5" />
                Upload Files
              </Button>
            </Link>
          </div>

          {isConnected && (
            <div className="pt-4 flex items-center justify-center gap-2 text-sm text-green-400 animate-fade-in">
              <CheckCircle className="h-4 w-4" />
              Wallet connected successfully.
            </div>
          )}
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Three Simple Steps</h2>
          <p className="text-muted-foreground text-lg">
            A quick guide to securing your medical data on the blockchain.
          </p>
        </div>

        <div className="space-y-10">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="flex gap-6 md:gap-8">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  {idx < steps.length - 1 && <div className="w-1 h-16 bg-border mt-2" />}
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">Step {idx + 1}: {step.title}</h3>
                  <p className="text-muted-foreground text-lg mb-4">{step.description}</p>
                  <div className="bg-card/50 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground">
                    <strong>{step.details}</strong>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-semibold">MedVault</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Demonstrating CESS Network for decentralized medical data infrastructure.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            Powered by CESS Network
          </div>
        </div>
      </footer>

    </div>
  )
}

