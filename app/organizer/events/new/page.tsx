"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const categories = ["FEST", "WORKSHOP", "MUSIC", "TECH", "COMMUNITY", "POPUP"]

export default function CreateEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    startsAt: "",
    endsAt: "",
    ticketPrice: "0",
    maxCapacity: "100",
    category: "FEST",
    imageUrl: "",
  })
  const [error, setError] = useState("")

  const submit = async () => {
    setError("")
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, startsAt: new Date(form.startsAt).toISOString(), endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined }),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ? JSON.stringify(body.error) : "Failed to create event")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">Create event</h1>
        <div className="mt-6 grid gap-3 rounded-2xl border bg-card p-5">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <Input placeholder="Address" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
          <Input placeholder="City" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Latitude" value={form.latitude} onChange={(e) => setForm((prev) => ({ ...prev, latitude: e.target.value }))} />
            <Input placeholder="Longitude" value={form.longitude} onChange={(e) => setForm((prev) => ({ ...prev, longitude: e.target.value }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((prev) => ({ ...prev, startsAt: e.target.value }))} />
            <Input type="datetime-local" value={form.endsAt} onChange={(e) => setForm((prev) => ({ ...prev, endsAt: e.target.value }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input type="number" placeholder="Ticket price" value={form.ticketPrice} onChange={(e) => setForm((prev) => ({ ...prev, ticketPrice: e.target.value }))} />
            <Input type="number" placeholder="Max capacity" value={form.maxCapacity} onChange={(e) => setForm((prev) => ({ ...prev, maxCapacity: e.target.value }))} />
          </div>
          <select className="rounded-md border bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={submit}>Create event</Button>
        </div>
      </main>
    </div>
  )
}
