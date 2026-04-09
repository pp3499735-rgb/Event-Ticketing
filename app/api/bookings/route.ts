import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function generateBookingNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "LT-"
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      events (
        id,
        title,
        image_url,
        date,
        time,
        venue,
        city
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { event_id, quantity, attendee_name, attendee_email, attendee_phone } = body

  // Fetch event to calculate total amount and check availability
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("price, total_tickets, tickets_sold")
    .eq("id", event_id)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const availableTickets = event.total_tickets - event.tickets_sold
  if (quantity > availableTickets) {
    return NextResponse.json(
      { error: `Only ${availableTickets} tickets available` },
      { status: 400 }
    )
  }

  const total_amount = event.price * quantity
  const booking_number = generateBookingNumber()
  const qr_code = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking_number}`

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      booking_number,
      event_id,
      user_id: user.id,
      quantity,
      total_amount,
      attendee_name,
      attendee_email,
      attendee_phone,
      qr_code,
      status: "confirmed",
    })
    .select()
    .single()

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  // Update tickets sold count
  const { error: updateError } = await supabase
    .from("events")
    .update({ tickets_sold: event.tickets_sold + quantity })
    .eq("id", event_id)

  if (updateError) {
    console.error("Failed to update ticket count:", updateError)
  }

  return NextResponse.json(booking)
}
