import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const city = searchParams.get("city")
  const search = searchParams.get("q")
  const featured = searchParams.get("featured")
  const trending = searchParams.get("trending")

  const supabase = await createClient()

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "active")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  if (city && city !== "All Cities") {
    query = query.eq("city", city)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,venue.ilike.%${search}%`)
  }

  if (featured === "true") {
    query = query.eq("is_featured", true)
  }

  if (trending === "true") {
    query = query.eq("is_trending", true)
  }

  const { data, error } = await query

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

  const { data, error } = await supabase
    .from("events")
    .insert({
      ...body,
      organizer_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
