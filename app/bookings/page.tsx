"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Calendar, MapPin, Clock, Ticket, AlertCircle, QrCode } from "lucide-react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Booking {
  id: string
  booking_number: string
  quantity: number
  total_amount: number
  attendee_name: string
  attendee_email: string
  status: string
  qr_code: string
  created_at: string
  events: {
    id: string
    title: string
    image_url: string
    date: string
    time: string
    venue: string
    city: string
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings")
        if (!response.ok) {
          throw new Error("Failed to fetch bookings")
        }
        const data = await response.json()
        setBookings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My Bookings
            </h1>
            <p className="mt-1 text-muted-foreground">
              View and manage your event tickets
            </p>
          </motion.div>

          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
              <h3 className="text-lg font-semibold">Error Loading Bookings</h3>
              <p className="mt-1 text-muted-foreground">{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <Ticket className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No bookings yet</h3>
              <p className="mt-1 text-muted-foreground">
                When you book tickets for events, they will appear here
              </p>
              <Button className="mt-4" asChild>
                <Link href="/events">Discover Events</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card>
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-32 w-full shrink-0 overflow-hidden sm:h-auto sm:w-40">
                          {booking.events?.image_url ? (
                            <img
                              src={booking.events.image_url}
                              alt={booking.events.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold">
                                  {booking.events?.title || "Unknown Event"}
                                </h3>
                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {booking.events?.date
                                      ? new Date(booking.events.date).toLocaleDateString(
                                          "en-IN",
                                          {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                          }
                                        )
                                      : "Date TBD"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {booking.events?.time || "Time TBD"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {booking.events?.venue || "Venue TBD"}
                                  </span>
                                </div>
                              </div>
                              <Badge
                                variant="secondary"
                                className={
                                  booking.status === "confirmed"
                                    ? "bg-green-500/10 text-green-500"
                                    : booking.status === "cancelled"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-yellow-500/10 text-yellow-500"
                                }
                              >
                                {booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                            <div className="flex gap-6 text-sm">
                              <div>
                                <p className="text-muted-foreground">Booking ID</p>
                                <code className="font-medium">
                                  {booking.booking_number}
                                </code>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Tickets</p>
                                <p className="font-medium">{booking.quantity}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-medium text-primary">
                                  ₹{Number(booking.total_amount).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="gap-2">
                                    <QrCode className="h-4 w-4" />
                                    View QR
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm">
                                  <DialogHeader>
                                    <DialogTitle>Your Ticket QR Code</DialogTitle>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center py-4">
                                    <div className="rounded-lg border border-border bg-white p-4">
                                      <img
                                        src={booking.qr_code}
                                        alt="Ticket QR Code"
                                        className="h-48 w-48"
                                        crossOrigin="anonymous"
                                      />
                                    </div>
                                    <p className="mt-4 text-center text-sm text-muted-foreground">
                                      Show this QR code at the event entrance
                                    </p>
                                    <code className="mt-2 rounded bg-muted px-3 py-1 text-sm">
                                      {booking.booking_number}
                                    </code>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" asChild>
                                <Link href={`/events/${booking.events?.id}`}>
                                  View Event
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
