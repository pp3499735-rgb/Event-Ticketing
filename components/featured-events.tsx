"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/event-card"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { events } from "@/lib/data"

export function FeaturedEvents() {
  const featuredEvents = events.slice(0, 4)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trending this week
            </h2>
            <p className="mt-2 text-muted-foreground">
              The hottest events everyone&apos;s talking about
            </p>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/events">
              View all events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
