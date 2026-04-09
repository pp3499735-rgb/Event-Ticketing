"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type EventItem = {
  id: string
  title: string
  description: string
  city: string
  address: string
  startsAt: string
  ticketPrice: number
  category: string
  distanceKm: number | null
  _count: { bookings: number }
  maxCapacity: number
}

const categories = ["ALL", "FEST", "WORKSHOP", "MUSIC", "TECH", "COMMUNITY", "POPUP"]

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("ALL")
  const [city, setCity] = useState("")
  const [date, setDate] = useState("")
  const [maxDistanceKm, setMaxDistanceKm] = useState(10)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setCoords(null)
      },
    )
  }, [])

  useEffect(() => {
    const query = new URLSearchParams()
    if (debouncedSearch) query.set("q", debouncedSearch)
    if (city) query.set("city", city)
    if (category !== "ALL") query.set("category", category)
    if (date) query.set("date", date)
    query.set("maxDistanceKm", String(maxDistanceKm))
    if (coords) {
      query.set("lat", String(coords.lat))
      query.set("lng", String(coords.lng))
    }

    fetch(`/api/events?${query.toString()}`)
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => setEvents([]))
  }, [debouncedSearch, city, category, date, maxDistanceKm, coords])

  const cards = useMemo(
    () =>
      events.map((event) => (
        <Card key={event.id} className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-2 text-lg">{event.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{new Date(event.startsAt).toLocaleString()}</p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Badge variant="secondary">{event.category}</Badge>
            <p className="line-clamp-2 text-muted-foreground">{event.description}</p>
            <p>{event.address}, {event.city}</p>
            <p>{event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice}`}</p>
            <p>{event._count.bookings}/{event.maxCapacity} booked</p>
            {event.distanceKm !== null && <p>{event.distanceKm.toFixed(1)} km away</p>}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/events/${event.id}`}>View & Book</Link>
            </Button>
          </CardFooter>
        </Card>
      )),
    [events],
  )

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Nearby events</h1>
        <div className="mt-4 grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-5">
          <Input placeholder="Search events" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input type="number" min={1} max={100} value={maxDistanceKm} onChange={(e) => setMaxDistanceKm(Number(e.target.value))} />
          <select className="rounded-md border bg-background px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards}</section>
      </main>
    </div>
  )
}
