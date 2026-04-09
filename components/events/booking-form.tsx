"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function BookingForm({ eventId }: { eventId: string }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const book = async () => {
    setLoading(true)
    setError("")
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, quantity }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? "Could not complete booking")
      return
    }

    router.push(`/bookings/${data.id}`)
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <label className="text-sm">Tickets</label>
      <Input type="number" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" disabled={loading} onClick={book}>
        {loading ? "Booking..." : "Book ticket"}
      </Button>
    </div>
  )
}
