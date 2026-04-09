"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Upload, Calendar, MapPin, IndianRupee, Ticket } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

const categories = [
  { value: "college-fest", label: "College Fest" },
  { value: "workshop", label: "Workshop" },
  { value: "music", label: "Music" },
  { value: "comedy", label: "Comedy" },
  { value: "food", label: "Food & Drinks" },
]

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Jaipur",
]

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    endTime: "",
    venue: "",
    city: "",
    address: "",
    price: "",
    totalTickets: "100",
    imageUrl: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get user profile for organizer name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          date: formData.date,
          time: formData.time,
          end_time: formData.endTime,
          venue: formData.venue,
          city: formData.city,
          address: formData.address,
          price: parseFloat(formData.price) || 0,
          total_tickets: parseInt(formData.totalTickets) || 100,
          image_url: formData.imageUrl || null,
          organizer_name: profile?.full_name || user.email?.split("@")[0] || "Organizer",
          organizer_verified: false,
          status: "active",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create event")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    formData.title &&
    formData.category &&
    formData.date &&
    formData.time &&
    formData.venue &&
    formData.city

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-6 gap-2"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create New Event</CardTitle>
                <CardDescription>
                  Fill in the details below to create your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Calendar className="h-4 w-4 text-primary" />
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., TechFest 2026"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Tell attendees what your event is about..."
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(v) => handleSelectChange("category", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                          id="imageUrl"
                          name="imageUrl"
                          placeholder="https://example.com/image.jpg"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Calendar className="h-4 w-4 text-primary" />
                      Date & Time
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Start Time *</Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          name="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <MapPin className="h-4 w-4 text-primary" />
                      Location
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="venue">Venue *</Label>
                        <Input
                          id="venue"
                          name="venue"
                          placeholder="e.g., Convention Center"
                          value={formData.venue}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(v) => handleSelectChange("city", v)}
                        >
                          <SelectTrigger>
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
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Street address, building, floor..."
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Tickets */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Ticket className="h-4 w-4 text-primary" />
                      Tickets
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price">Ticket Price (₹)</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0 for free"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalTickets">Total Tickets</Label>
                        <Input
                          id="totalTickets"
                          name="totalTickets"
                          type="number"
                          min="1"
                          placeholder="100"
                          value={formData.totalTickets}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={!isFormValid || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
