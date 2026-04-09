"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
  Lightbulb,
  Music,
  Laugh,
  UtensilsCrossed,
  Sparkles,
  X,
  Calendar,
  MapPin,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Event {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  date: string
  time: string
  venue: string
  city: string
  price: number
  total_tickets: number
  tickets_sold: number
}

const cities = [
  "All Cities",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Jaipur",
]

const categoryIcons = {
  all: Sparkles,
  "college-fest": GraduationCap,
  workshop: Lightbulb,
  music: Music,
  comedy: Laugh,
  food: UtensilsCrossed,
}

const categoryLabels = {
  all: "All Events",
  "college-fest": "College Fests",
  workshop: "Workshops",
  music: "Music",
  comedy: "Comedy",
  food: "Food & Drinks",
}

const categoryColors: Record<string, string> = {
  "college-fest": "bg-blue-500/10 text-blue-500",
  workshop: "bg-amber-500/10 text-amber-500",
  music: "bg-pink-500/10 text-pink-500",
  comedy: "bg-orange-500/10 text-orange-500",
  food: "bg-green-500/10 text-green-500",
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const price = Number(event.price) || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/events/${event.id}`}>
        <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <Badge
              variant="secondary"
              className={`absolute left-3 top-3 ${categoryColors[event.category] || "bg-primary/10 text-primary"}`}
            >
              {event.category.replace("-", " ")}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="mb-2 font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(event.date).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
                {" at "}
                {event.time}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.venue}, {event.city}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-primary">
                {price === 0 ? "Free" : `₹${price}`}
              </span>
              <span className="text-xs text-muted-foreground">
                {event.total_tickets - event.tickets_sold} left
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

function EventsPageLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </main>
      <Footer />
    </div>
  )
}

function EventsContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialCity = searchParams.get("city") || "All Cities"
  const initialCategory = searchParams.get("category") || "all"

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set("q", searchQuery)
        if (selectedCity !== "All Cities") params.set("city", selectedCity)
        if (selectedCategory !== "all") params.set("category", selectedCategory)

        const response = await fetch(`/api/events?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        }
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchQuery, selectedCity, selectedCategory])

  const filteredEvents = events.filter((event) => {
    const price = Number(event.price) || 0
    if (priceRange === "free" && price !== 0) return false
    if (priceRange === "under500" && price >= 500) return false
    if (priceRange === "500to1000" && (price < 500 || price > 1000)) return false
    if (priceRange === "above1000" && price <= 1000) return false
    return true
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCity("All Cities")
    setSelectedCategory("all")
    setPriceRange("all")
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCity !== "All Cities" ||
    selectedCategory !== "all" ||
    priceRange !== "all"

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border bg-muted/30 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Discover Events
              </h1>
              <p className="mt-2 text-muted-foreground">
                Find the perfect event for you
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mt-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-10"
                  />
                </div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-11 w-full sm:w-44">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="h-11 gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0">
                      !
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="text-sm font-medium">Price:</span>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="h-9 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="under500">Under ₹500</SelectItem>
                          <SelectItem value="500to1000">₹500 - ₹1000</SelectItem>
                          <SelectItem value="above1000">Above ₹1000</SelectItem>
                        </SelectContent>
                      </Select>

                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto gap-1 text-muted-foreground"
                          onClick={clearFilters}
                        >
                          <X className="h-4 w-4" />
                          Clear all
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Pills */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {Object.entries(categoryLabels).map(([id, label]) => {
                  const Icon = categoryIcons[id as keyof typeof categoryIcons]
                  const isActive = selectedCategory === id
                  return (
                    <Button
                      key={id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className="shrink-0 gap-2"
                      onClick={() => setSelectedCategory(id)}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  "Loading events..."
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {filteredEvents.length}
                    </span>{" "}
                    events
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner className="h-8 w-8" />
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No events found</h3>
                <p className="mt-1 text-muted-foreground">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters"
                    : "Be the first to create an event!"}
                </p>
                {hasActiveFilters ? (
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : (
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/create-event">Create Event</Link>
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsPageLoading />}>
      <EventsContent />
    </Suspense>
  )
}
