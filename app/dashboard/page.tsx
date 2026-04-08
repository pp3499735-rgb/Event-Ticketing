"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { events } from "@/lib/data"

// Mock organizer events (first 3 events)
const organizerEvents = events.slice(0, 3)

// Calculate totals
const totalRevenue = organizerEvents.reduce(
  (acc, event) => acc + event.price * event.soldTickets,
  0
)
const totalTicketsSold = organizerEvents.reduce(
  (acc, event) => acc + event.soldTickets,
  0
)
const totalAttendees = organizerEvents.reduce(
  (acc, event) => acc + event.attendees.length,
  0
)

// Get all attendees from all events
const allAttendees = organizerEvents.flatMap((event) =>
  event.attendees.map((attendee) => ({
    ...attendee,
    eventName: event.title,
    eventId: event.id,
  }))
)

export default function DashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAttendees = allAttendees.filter((attendee) => {
    const matchesEvent =
      selectedEvent === "all" || attendee.eventId === selectedEvent
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesEvent && matchesSearch
  })

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Tickets Sold",
      value: totalTicketsSold.toLocaleString(),
      icon: Ticket,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Total Attendees",
      value: totalAttendees.toLocaleString(),
      icon: Users,
      change: "+15.3%",
      changeType: "positive" as const,
    },
    {
      title: "Active Events",
      value: organizerEvents.length.toString(),
      icon: Calendar,
      change: "0%",
      changeType: "neutral" as const,
    },
  ]

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
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
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
                <Button variant="ghost" size="sm" className="gap-2">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizerEvents.map((event) => {
                    const soldPercentage = Math.round(
                      (event.soldTickets / event.totalTickets) * 100
                    )
                    const revenue = event.price * event.soldTickets

                    return (
                      <div
                        key={event.id}
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="flex flex-1 items-center gap-4">
                          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
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
                              {event.soldTickets}
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
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
                      {organizerEvents.map((event) => (
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
                {filteredAttendees.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Attendee</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Ticket ID</TableHead>
                          <TableHead>Tickets</TableHead>
                          <TableHead>Booking Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAttendees.map((attendee) => (
                          <TableRow key={attendee.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {attendee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{attendee.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {attendee.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="max-w-[150px] truncate">
                                {attendee.eventName}
                              </p>
                            </TableCell>
                            <TableCell>
                              <code className="rounded bg-muted px-2 py-1 text-sm">
                                {attendee.ticketId}
                              </code>
                            </TableCell>
                            <TableCell>{attendee.ticketCount}</TableCell>
                            <TableCell>
                              {new Date(attendee.bookingDate).toLocaleDateString(
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
                                className="bg-green-500/10 text-green-500"
                              >
                                Confirmed
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
    </div>
  )
}
