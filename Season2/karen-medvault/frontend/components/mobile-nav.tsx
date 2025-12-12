"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, ShieldCheck, Home, BookOpen, Rocket, LayoutDashboard, X } from "lucide-react"

interface MobileNavProps {
  currentPath?: string
}

export function MobileNav({ currentPath = "/" }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/learn-more", label: "Learn More", icon: BookOpen },
    { href: "/get-started", label: "Get Started", icon: Rocket },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">MedVault</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span>Testnet Active</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Powered by CESS Network</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
