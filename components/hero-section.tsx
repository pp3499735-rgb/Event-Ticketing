"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MapPin, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { cities } from "@/lib/data"

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("All Cities")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (selectedCity !== "All Cities") params.set("city", selectedCity)
    router.push(`/events?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Discover amazing local events near you</span>
          </motion.div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find events that
            <span className="text-primary"> ignite </span>
            your passion
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            From college fests to indie concerts, discover and book tickets to the
            most exciting events happening in your city.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:rounded-full sm:border sm:border-border sm:bg-card sm:p-2 sm:shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-border bg-card pl-12 sm:border-0 sm:bg-transparent sm:shadow-none sm:focus-visible:ring-0"
                />
              </div>
              <div className="flex gap-3 sm:gap-2">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12 w-full border-border bg-card sm:w-40 sm:border-0 sm:bg-muted/50">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="lg" className="h-12 px-8 sm:rounded-full">
                  Search
                </Button>
              </div>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Techfest", "Music Nights", "Workshops", "Food Fests"].map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                className="h-8 rounded-full bg-muted/50 text-sm hover:bg-muted"
                onClick={() => {
                  setSearchQuery(tag)
                  router.push(`/events?q=${encodeURIComponent(tag)}`)
                }}
              >
                {tag}
              </Button>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {[
            { label: "Events Listed", value: "2,500+" },
            { label: "Happy Attendees", value: "1M+" },
            { label: "Cities Covered", value: "50+" },
            { label: "Organizers", value: "5,000+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
