"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { events, cities } from "@/lib/data"

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

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search query filter
      if (
        searchQuery &&
        !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // City filter
      if (selectedCity !== "All Cities" && event.city !== selectedCity) {
        return false
      }

      // Category filter
      if (selectedCategory !== "all" && event.category !== selectedCategory) {
        return false
      }

      // Price range filter
      if (priceRange === "free" && event.price !== 0) return false
      if (priceRange === "under500" && event.price >= 500) return false
      if (priceRange === "500to1000" && (event.price < 500 || event.price > 1000))
        return false
      if (priceRange === "above1000" && event.price <= 1000) return false

      return true
    })
  }, [searchQuery, selectedCity, selectedCategory, priceRange])

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
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredEvents.length}
                </span>{" "}
                events
              </p>
            </div>

            {filteredEvents.length > 0 ? (
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
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
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
