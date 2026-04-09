"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Ticket } from "lucide-react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Ticket className="h-5 w-5 text-primary" />
          <span>HyperLocal</span>
        </Link>
        <nav className="hidden gap-5 text-sm md:flex">
          <Link href="/events">Discover</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/organizer/events/new">Create Event</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {session?.user ? (
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              Sign out
            </Button>
          ) : (
            <Button size="sm" onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
