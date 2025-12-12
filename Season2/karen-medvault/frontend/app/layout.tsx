import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/lib/web3-provider"
import { ToastProvider } from "@/components/toast-provider"
import "./globals.css"

// As fontes estão sendo importadas, mas não aplicadas no <body> abaixo.
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MedVault - CESS Network",
  description:
    "Secure, blockchain-based medical file management with decentralized storage on CESS Network. Control your healthcare data with smart contracts and cryptographic security.",
  generator: "v0.app",

  // ✅ ADICIONADO — favicon usando o arquivo que está na pasta /public
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Web3Provider>
          <ToastProvider />
          {children}
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}
