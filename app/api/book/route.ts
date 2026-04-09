import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createBookingSchema } from "@/lib/validations"
import { randomUUID } from "crypto"

// Helper function to generate a unique ticket ID
function generateTicketId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = randomUUID().split("-")[0].toUpperCase()
  return `TKT-${timestamp}-${random}`
}

// Helper function to generate QR code hash
function generateQRCodeHash(ticketId: string, eventId: string, userId: string): string {
  const data = `${ticketId}:${eventId}:${userId}:${Date.now()}`
  // Simple hash - in production, use a proper cryptographic hash
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(16, "0")
}

// Mock payment processing function
async function processPayment(amount: number, userId: string, eventId: string): Promise<{
  success: boolean
  transactionId?: string
  error?: string
}> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  
  // Mock successful payment (in production, integrate with Stripe, etc.)
  // For demo purposes, payments always succeed
  return {
    success: true,
    transactionId: `PAY-${Date.now().toString(36).toUpperCase()}-${randomUUID().split("-")[0].toUpperCase()}`,
  }
}

// POST /api/book - Create a booking
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to book tickets." },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createBookingSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { event_id, ticket_count } = validationResult.data

    // Fetch the event and check availability
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      return NextResponse.json(
        { error: "This event has already occurred" },
        { status: 400 }
      )
    }

    // Check if enough slots are available
    if (event.available_slots < ticket_count) {
      return NextResponse.json(
        { 
          error: "Not enough tickets available",
          available_slots: event.available_slots,
          requested: ticket_count
        },
        { status: 400 }
      )
    }

    // Check for existing pending booking for same user and event
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("event_id", event_id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single()

    if (existingBooking) {
      return NextResponse.json(
        { error: "You already have a pending booking for this event" },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = event.price * ticket_count

    // Process mock payment
    const paymentResult = await processPayment(totalAmount, user.id, event_id)

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: "Payment failed", details: paymentResult.error },
        { status: 402 }
      )
    }

    // Generate ticket ID and QR code hash
    const ticketId = generateTicketId()
    const qrCodeHash = generateQRCodeHash(ticketId, event_id, user.id)

    // Start a transaction: create booking and update available slots
    // First, update the available slots (with optimistic locking)
    const { data: updatedEvent, error: updateError } = await supabase
      .from("events")
      .update({ 
        available_slots: event.available_slots - ticket_count 
      })
      .eq("id", event_id)
      .gte("available_slots", ticket_count) // Ensure slots are still available
      .select()
      .single()

    if (updateError || !updatedEvent) {
      // Slots may have been taken by another user
      return NextResponse.json(
        { error: "Tickets are no longer available. Please try again." },
        { status: 409 }
      )
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        event_id,
        user_id: user.id,
        ticket_count,
        status: "paid", // Mark as paid since payment succeeded
        qr_code_hash: qrCodeHash,
        ticket_id: ticketId,
        total_amount: totalAmount,
      })
      .select()
      .single()

    if (bookingError) {
      console.error("Error creating booking:", bookingError)
      
      // Rollback the slot update
      await supabase
        .from("events")
        .update({ available_slots: event.available_slots })
        .eq("id", event_id)

      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      )
    }

    // Return success response with ticket details
    return NextResponse.json({
      success: true,
      message: "Booking confirmed",
      booking: {
        id: booking.id,
        ticket_id: ticketId,
        event_title: event.title,
        event_date: event.date,
        event_location: event.location_name,
        ticket_count,
        total_amount: totalAmount,
        status: "paid",
        qr_code_hash: qrCodeHash,
        transaction_id: paymentResult.transactionId,
      },
    }, { status: 201 })

  } catch (error) {
    console.error("Unexpected error in POST /api/book:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /api/book - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      )
    }

    // Fetch user's bookings with event details
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        events (
          id,
          title,
          description,
          date,
          location_name,
          price,
          image_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      bookings: bookings || [],
      total: bookings?.length || 0,
    })

  } catch (error) {
    console.error("Unexpected error in GET /api/book:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
