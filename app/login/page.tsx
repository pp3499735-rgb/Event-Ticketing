"use client"

import { signIn } from "next-auth/react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Sign in to HyperLocal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button className="w-full" onClick={() => signIn("email", { email, callbackUrl: "/dashboard" })}>
                Continue with Email
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
