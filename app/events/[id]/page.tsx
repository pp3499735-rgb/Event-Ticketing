"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Heart,
  ChevronLeft,
  BadgeCheck,
  Ticket,
  AlertCircle,
} from "lucide-react"
import { motion } from "framer-motion"

interface Event {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  date: string
  time: string
  end_time: string
  venue: string
  city: string
  address: string
  price: number
  total_tickets: number
  tickets_sold: number
  organizer_id: string
  organizer_name: string
  organizer_verified: boolean
  status: string
}

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default function EventDetailPage({ params }: EventPageProps) {
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError("not_found")
          } else {
            throw new Error("Failed to fetch event")
          }
          return
        }
        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </main>
      </div>
    )
  }

  if (error === "not_found" || !event) {
    notFound()
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-lg font-semibold">Error Loading Event</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button asChild className="mt-4">
              <Link href="/events">Back to Events</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const price = Number(event.price) || 0
  const totalTickets = event.total_tickets || 100
  const ticketsSold = event.tickets_sold || 0
  const soldPercentage = Math.round((ticketsSold / totalTickets) * 100)
  const ticketsLeft = totalTickets - ticketsSold

  const categoryColors: Record<string, string> = {
    "college-fest": "bg-blue-500/10 text-blue-500",
    workshop: "bg-amber-500/10 text-amber-500",
    music: "bg-pink-500/10 text-pink-500",
    comedy: "bg-orange-500/10 text-orange-500",
    food: "bg-green-500/10 text-green-500",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Image */}
        <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-muted sm:h-[50vh]">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Calendar className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Back Button */}
          <div className="absolute left-4 top-4 z-10 sm:left-6">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
              asChild
            >
              <Link href="/events">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back to events</span>
              </Link>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-6">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="sr-only">Like event</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share event</span>
            </Button>
          </div>
        </section>

        {/* Content */}
        <section className="relative z-10 -mt-20 pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                      <Badge
                        variant="secondary"
                        className={`mb-4 ${categoryColors[event.category] || "bg-primary/10 text-primary"}`}
                      >
                        {event.category.replace("-", " ")}
                      </Badge>

                      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-balance">
                        {event.title}
                      </h1>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {formattedDate}
                            </p>
                            <p className="text-sm">{event.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {event.venue}
                            </p>
                            <p className="text-sm">{event.city}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Duration</p>
                            <p className="text-sm">
                              {event.end_time
                                ? `${event.time} - ${event.end_time}`
                                : "3-4 hours (approx.)"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {ticketsSold.toLocaleString()} attending
                            </p>
                            <p className="text-sm">{ticketsLeft} spots left</p>
                          </div>
                        </div>
                      </div>

                      {event.description && (
                        <div className="mt-8">
                          <h2 className="mb-4 text-lg font-semibold">About this event</h2>
                          <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {event.description}
                          </p>
                        </div>
                      )}

                      {/* Map Placeholder */}
                      <div className="mt-8">
                        <h2 className="mb-4 text-lg font-semibold">Location</h2>
                        <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-border bg-muted">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                              <p className="mt-2 font-medium">{event.venue}</p>
                              <p className="text-sm text-muted-foreground">
                                {event.address || event.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="sticky top-24 space-y-6"
                >
                  {/* Pricing Card */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-baseline justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Starting from
                          </p>
                          <p className="text-3xl font-bold text-primary">
                            {price === 0 ? "Free" : `₹${price}`}
                          </p>
                        </div>
                        {soldPercentage >= 80 && (
                          <Badge variant="destructive">Selling Fast</Badge>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {soldPercentage}% sold
                          </span>
                          <span className="font-medium">
                            {ticketsLeft} left
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${soldPercentage}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full gap-2"
                        size="lg"
                        onClick={() => setIsBookingOpen(true)}
                        disabled={ticketsLeft <= 0}
                      >
                        <Ticket className="h-5 w-5" />
                        {ticketsLeft <= 0 ? "Sold Out" : "Book Now"}
                      </Button>

                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        Instant confirmation
                      </p>
                    </CardContent>
                  </Card>

                  {/* Organizer Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-sm font-semibold">
                        Organized by
                      </h3>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {event.organizer_name?.charAt(0) || "O"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <p className="font-medium">{event.organizer_name}</p>
                            {event.organizer_verified && (
                              <BadgeCheck className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.organizer_verified
                              ? "Verified Organizer"
                              : "Event Organizer"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-4 w-full">
                        Contact Organizer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="text-xl font-bold text-primary">
                {price === 0 ? "Free" : `₹${price}`}
              </p>
            </div>
            <Button
              className="gap-2 px-8"
              size="lg"
              onClick={() => setIsBookingOpen(true)}
              disabled={ticketsLeft <= 0}
            >
              <Ticket className="h-5 w-5" />
              {ticketsLeft <= 0 ? "Sold Out" : "Book Now"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      <BookingModal
        event={event}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
      />
    </div>
  )
}
