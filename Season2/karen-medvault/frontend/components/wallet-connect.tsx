"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Wallet } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWeb3 } from "@/lib/web3-provider"

export default function WalletConnect() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { connect } = useWeb3()

  const connectWallet = async () => {
    setIsLoading(true)
    setError("")

    try {
      await connect()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-8 space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Connect Your Wallet</h2>
        <p className="text-muted-foreground">
          Connect your MetaMask wallet to access your medical files on CESS testnet
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={connectWallet} disabled={isLoading} size="lg" className="w-full gap-2">
        <Wallet className="h-5 w-5" />
        {isLoading ? "Connecting..." : "Connect MetaMask"}
      </Button>

      <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t border-border">
        <p>
          <strong>Network:</strong> CESS testnet
        </p>
        <p>
          <strong>Storage:</strong> CESS Network DeOSS
        </p>
        <p>
          <strong>Contract:</strong> 0x104CF613c855Be2F558d7A449DE6F2b727Ae1818
        </p>
      </div>
    </Card>
  )
}
