"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Check, QrCode, Ticket, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

interface Event {
  id: string
  title: string
  price: number
  date: string
  total_tickets?: number
  tickets_sold?: number
}

interface BookingModalProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "select" | "details" | "success"

interface BookingResult {
  booking_number: string
  qr_code: string
  quantity: number
  total_amount: number
}

export function BookingModal({ event, open, onOpenChange }: BookingModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("select")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const price = Number(event.price) || 0
  const total = price * quantity
  const platformFee = Math.round(total * 0.02)

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleContinue = async () => {
    if (step === "select") {
      // Check if user is logged in
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Redirect to login
        router.push(`/auth/login?redirect=/events/${event.id}`)
        return
      }
      
      setStep("details")
    } else if (step === "details") {
      await handleBooking()
    }
  }

  const handleBooking = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event.id,
          quantity,
          attendee_name: `${formData.firstName} ${formData.lastName}`,
          attendee_email: formData.email,
          attendee_phone: formData.phone,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create booking")
      }

      const booking = await response.json()
      setBookingResult(booking)
      setStep("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep("select")
      setQuantity(1)
      setFormData({ firstName: "", lastName: "", email: "", phone: "" })
      setError(null)
      setBookingResult(null)
    }, 300)
  }

  const isDetailsValid =
    formData.firstName && formData.lastName && formData.email && formData.phone

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="border-b border-border p-6">
                <DialogTitle className="text-xl">Select tickets</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        General Admission
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {price === 0 ? "Free" : `₹${price}`}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mb-6 space-y-2 rounded-lg border border-border p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {quantity} x ₹{price}
                    </span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">
                        ₹{total + platformFee}
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full gap-2" size="lg" onClick={handleContinue}>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="border-b border-border p-6">
                <DialogTitle className="text-xl">Attendee details</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <p className="mb-4 text-sm text-muted-foreground">
                  Enter your information to receive your tickets
                </p>
                <div className="mb-6 grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Rahul"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Sharma"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}

                <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order total</span>
                    <span className="font-semibold text-primary">
                      ₹{total + platformFee}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleContinue}
                  disabled={!isDetailsValid || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Ticket className="h-4 w-4" />
                      Complete booking
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "success" && bookingResult && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <Check className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="mb-2 text-2xl font-bold">Booking confirmed!</h2>
              <p className="mb-6 text-muted-foreground">
                Your tickets for {event.title} have been booked successfully.
              </p>

              <div className="mb-6 rounded-xl border border-border bg-muted/30 p-6">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-lg border border-border bg-white p-4">
                    {bookingResult.qr_code ? (
                      <img 
                        src={bookingResult.qr_code} 
                        alt="QR Code" 
                        className="h-32 w-32"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <QrCode className="h-32 w-32 text-foreground" />
                    )}
                  </div>
                </div>
                <p className="mb-1 font-mono text-sm font-semibold">
                  {bookingResult.booking_number}
                </p>
                <p className="text-xs text-muted-foreground">
                  Show this QR code at the venue
                </p>
              </div>

              <div className="mb-6 rounded-lg border border-border p-4 text-left">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span>
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Tickets</span>
                  <span>{bookingResult.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total paid</span>
                  <span className="font-semibold text-primary">
                    ₹{Number(bookingResult.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => router.push("/bookings")}>
                  View My Bookings
                </Button>
                <Button className="flex-1" onClick={handleClose}>
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
