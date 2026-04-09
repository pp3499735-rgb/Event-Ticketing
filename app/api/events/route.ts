import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createEventSchema, getEventsQuerySchema } from "@/lib/validations"

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// GET /api/events - Fetch events, optionally filtered by location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const queryResult = getEventsQuerySchema.safeParse({
      latitude: searchParams.get("latitude"),
      longitude: searchParams.get("longitude"),
      radius: searchParams.get("radius"),
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
      category: searchParams.get("category"),
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const { latitude, longitude, radius, limit, offset, category } = queryResult.data

    const supabase = await createClient()

    // Build query
    let query = supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString()) // Only future events
      .gt("available_slots", 0) // Only events with available slots
      .order("date", { ascending: true })

    // Filter by category if provided
    if (category) {
      query = query.eq("category", category)
    }

    const { data: events, error } = await query

    if (error) {
      console.error("Error fetching events:", error)
      return NextResponse.json(
        { error: "Failed to fetch events" },
        { status: 500 }
      )
    }

    // If location coordinates are provided, filter by distance
    let filteredEvents = events || []
    
    if (latitude !== undefined && longitude !== undefined) {
      filteredEvents = filteredEvents
        .filter((event) => {
          if (event.latitude === null || event.longitude === null) {
            return true // Include events without location
          }
          const distance = calculateDistance(
            latitude,
            longitude,
            event.latitude,
            event.longitude
          )
          return distance <= radius
        })
        .map((event) => ({
          ...event,
          distance:
            event.latitude !== null && event.longitude !== null
              ? calculateDistance(latitude, longitude, event.latitude, event.longitude)
              : null,
        }))
        .sort((a, b) => {
          // Sort by distance if both have location, otherwise by date
          if (a.distance !== null && b.distance !== null) {
            return a.distance - b.distance
          }
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
    }

    // Apply pagination
    const paginatedEvents = filteredEvents.slice(offset, offset + limit)

    return NextResponse.json({
      events: paginatedEvents,
      total: filteredEvents.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Unexpected error in GET /api/events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event (organizers only)
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
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      )
    }

    // Check if user is an organizer
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    if (userProfile.role !== "organizer") {
      return NextResponse.json(
        { error: "Only organizers can create events" },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createEventSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid event data", details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const eventData = validationResult.data

    // Create the event
    const { data: newEvent, error: createError } = await supabase
      .from("events")
      .insert({
        creator_id: user.id,
        title: eventData.title,
        description: eventData.description || null,
        price: eventData.price,
        latitude: eventData.latitude || null,
        longitude: eventData.longitude || null,
        location_name: eventData.location_name || null,
        date: eventData.date,
        total_slots: eventData.total_slots,
        available_slots: eventData.total_slots, // Initially all slots are available
        image_url: eventData.image_url || null,
        category: eventData.category || null,
      })
      .select()
      .single()

    if (createError) {
      console.error("Error creating event:", createError)
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    )
  } catch (error) {
    console.error("Unexpected error in POST /api/events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
