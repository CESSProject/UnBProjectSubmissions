
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import WalletConnect from "@/components/wallet-connect"
import FileUploadCard from "@/components/file-upload-card"
import FileList from "@/components/file-list"
import AccessControlPanel from "@/components/access-control-panel"
import {
  FileText,
  Users,
  LogOut,
  ShieldCheck,
  Cpu,
  Lock,
  Database,
  RefreshCw,
} from "lucide-react"
import { useWeb3 } from "@/lib/web3-provider"
import { MobileNav } from "@/components/mobile-nav"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { useToast } from "@/hooks/use-toast"
import { useMedVault } from "@/hooks/use-medvault"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("files")
  const { isConnected, account, disconnect } = useWeb3()
  const { toast } = useToast()

  const { files, isLoading, loadUserFiles } = useMedVault()

  const handleSync = async () => {
    toast({
      title: "Synchronizing",
      description: "Fetching latest files from blockchain...",
    })

    await loadUserFiles()

    toast({
      title: "Sync Complete",
      description: `Found ${files.length} file(s)`,
    })
  }

  const handleFileUpload = async () => {
    console.log("[v0] File uploaded, refreshing list...")
    await loadUserFiles()
  }

  const handleFileDeleted = async () => {
    console.log("[v0] File deleted, refreshing list...")
    await loadUserFiles()
  }

  const handleManageAccess = (file: any) => {
    setActiveTab("access")
    toast({
      title: "Managing Access",
      description: `Selected file: ${file.cid.slice(0, 16)}...`,
    })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "You have been logged out successfully",
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-md">
          <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">MedVault Dashboard</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="hidden text-sm font-medium transition-colors hover:text-foreground sm:block text-muted-foreground"
              >
                Back to Home
              </Link>
              <MobileNav currentPath="/dashboard" />
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-card/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xl font-semibold">MedVault</div>
                <div className="text-xs text-slate-400">
                  Powered by CESS Network
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-2 text-sm text-muted-foreground sm:flex">
                <Database className="h-4 w-4 text-accent" />
                <span>DeOSS Local</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              </div>

              <div className="hidden rounded-lg bg-muted/30 px-3 py-1.5 font-mono text-sm text-muted-foreground sm:block">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isLoading}
                className="gap-2 bg-transparent"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Sync</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Disconnect</span>
              </Button>
              <MobileNav currentPath="/dashboard" />
            </div>
          </div>
        </div>
      </nav>

      {/* Technology Info Bar */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            <span>Proxy Re-Encryption</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="h-4 w-4 text-accent" />
            <span>PoDR² Verified</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4 text-primary" />
            <span>{files.length} Files Registered</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("files")}
              className={`px-1 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "files"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Files
                {files.length > 0 && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    {files.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("access")}
              className={`px-1 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "access"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Access Control
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {activeTab === "files" && (
              <div className="animate-fade-in space-y-6">
                <FileUploadCard
                  onUpload={handleFileUpload}
                  walletAddress={account || ""}
                />
                <FileList
                  files={files}
                  walletAddress={account || ""}
                  isLoading={isLoading}
                  onManageAccess={handleManageAccess}
                  onFileDeleted={handleFileDeleted}
                />
              </div>
            )}

            {activeTab === "access" && (
              <AccessControlPanel files={files} walletAddress={account || ""} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
