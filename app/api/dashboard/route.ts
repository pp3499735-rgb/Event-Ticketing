import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get organizer's events
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false })

  if (eventsError) {
    return NextResponse.json({ error: eventsError.message }, { status: 500 })
  }

  // Get all bookings for organizer's events
  const eventIds = events?.map((e) => e.id) || []
  
  let bookings: any[] = []
  if (eventIds.length > 0) {
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        *,
        events (
          id,
          title
        )
      `)
      .in("event_id", eventIds)
      .order("created_at", { ascending: false })

    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 })
    }

    bookings = bookingsData || []
  }

  // Calculate stats
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total_amount), 0)
  const ticketsSold = bookings.reduce((sum, b) => sum + b.quantity, 0)
  const totalAttendees = bookings.length
  const activeEvents = events?.filter((e) => e.status === "active").length || 0

  return NextResponse.json({
    events,
    bookings,
    stats: {
      totalRevenue,
      ticketsSold,
      totalAttendees,
      activeEvents,
    },
  })
}
