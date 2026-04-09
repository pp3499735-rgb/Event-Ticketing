"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IndianRupee,
  Ticket,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Link from "next/link"

interface Event {
  id: string
  title: string
  image_url: string
  date: string
  time: string
  venue: string
  city: string
  price: number
  total_tickets: number
  tickets_sold: number
  status: string
}

interface Booking {
  id: string
  booking_number: string
  quantity: number
  total_amount: number
  attendee_name: string
  attendee_email: string
  status: string
  created_at: string
  events: {
    id: string
    title: string
  }
}

interface DashboardData {
  events: Event[]
  bookings: Booking[]
  stats: {
    totalRevenue: number
    ticketsSold: number
    totalAttendees: number
    activeEvents: number
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const filteredBookings = data?.bookings.filter((booking) => {
    const matchesEvent =
      selectedEvent === "all" || booking.events?.id === selectedEvent
    const matchesSearch =
      booking.attendee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.attendee_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booking_number.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesEvent && matchesSearch
  }) || []

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${(data?.stats.totalRevenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Tickets Sold",
      value: (data?.stats.ticketsSold || 0).toLocaleString(),
      icon: Ticket,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Total Attendees",
      value: (data?.stats.totalAttendees || 0).toLocaleString(),
      icon: Users,
      change: "+15.3%",
      changeType: "positive" as const,
    },
    {
      title: "Active Events",
      value: (data?.stats.activeEvents || 0).toString(),
      icon: Calendar,
      change: "0%",
      changeType: "neutral" as const,
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-lg font-semibold">Error Loading Dashboard</h2>
            <p className="mt-2 text-muted-foreground">{error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Organizer Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage your events and track performance
              </p>
            </div>
            <Button className="gap-2" asChild>
              <Link href="/dashboard/create-event">
                <Plus className="h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    {stat.changeType === "positive" && (
                      <div className="flex items-center gap-1 text-sm text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Events Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Events</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.events && data.events.length > 0 ? (
                  <div className="space-y-4">
                    {data.events.map((event) => {
                      const soldPercentage = Math.round(
                        (event.tickets_sold / event.total_tickets) * 100
                      )
                      const revenue = event.price * event.tickets_sold

                      return (
                        <div
                          key={event.id}
                          className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                        >
                          <div className="flex flex-1 items-center gap-4">
                            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {event.image_url ? (
                                <img
                                  src={event.image_url}
                                  alt={event.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Calendar className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-semibold">
                                {event.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(event.date).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}{" "}
                                at {event.time}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                            <div className="text-center">
                              <p className="text-lg font-semibold">
                                {event.tickets_sold}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Tickets
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-primary">
                                ₹{revenue.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Revenue
                              </p>
                            </div>
                            <div className="min-w-[100px]">
                              <div className="mb-1 flex justify-between text-xs">
                                <span>{soldPercentage}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${soldPercentage}%` }}
                                />
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/events/${event.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Cancel Event
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No events yet</h3>
                    <p className="mt-1 text-muted-foreground">
                      Create your first event to get started
                    </p>
                    <Button className="mt-4 gap-2" asChild>
                      <Link href="/dashboard/create-event">
                        <Plus className="h-4 w-4" />
                        Create Event
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendees Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Attendees</CardTitle>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search attendees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-full pl-9 sm:w-64"
                    />
                  </div>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="h-9 w-full sm:w-48">
                      <SelectValue placeholder="Filter by event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {data?.events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filteredBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Attendee</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Tickets</TableHead>
                          <TableHead>Booking Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {booking.attendee_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{booking.attendee_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.attendee_email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="max-w-[150px] truncate">
                                {booking.events?.title || "Unknown Event"}
                              </p>
                            </TableCell>
                            <TableCell>
                              <code className="rounded bg-muted px-2 py-1 text-sm">
                                {booking.booking_number}
                              </code>
                            </TableCell>
                            <TableCell>{booking.quantity}</TableCell>
                            <TableCell>
                              {new Date(booking.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell>
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
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No attendees found</h3>
                    <p className="mt-1 text-muted-foreground">
                      {searchQuery || selectedEvent !== "all"
                        ? "Try adjusting your filters"
                        : "Attendees will appear here once tickets are booked"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
