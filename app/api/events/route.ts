import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { haversineDistanceKm } from "@/lib/geo"

const eventBody = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  address: z.string().min(3),
  city: z.string().min(2),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  ticketPrice: z.coerce.number().int().min(0),
  maxCapacity: z.coerce.number().int().min(1),
  category: z.enum(["FEST", "WORKSHOP", "MUSIC", "TECH", "COMMUNITY", "POPUP"]),
  imageUrl: z.string().url().optional().or(z.literal("")),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")
  const category = searchParams.get("category")
  const date = searchParams.get("date")
  const q = searchParams.get("q")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const maxDistanceKm = Number(searchParams.get("maxDistanceKm") ?? 10)

  const events = await prisma.event.findMany({
    where: {
      city: city || undefined,
      category: (category as never) || undefined,
      startsAt: date
        ? {
            gte: new Date(`${date}T00:00:00.000Z`),
            lte: new Date(`${date}T23:59:59.999Z`),
          }
        : undefined,
      OR: q
        ? [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      organizer: {
        select: { id: true, name: true, image: true },
      },
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: { startsAt: "asc" },
  })

  const hydrated = events
    .map((event) => {
      const distanceKm =
        lat && lng
          ? haversineDistanceKm(Number(lat), Number(lng), event.latitude, event.longitude)
          : null
      return {
        ...event,
        distanceKm,
      }
    })
    .filter((event) => (event.distanceKm !== null ? event.distanceKm <= maxDistanceKm : true))

  return NextResponse.json(hydrated)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Organizer access required" }, { status: 403 })
  }

  const parsed = eventBody.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
      imageUrl: parsed.data.imageUrl || null,
      organizerId: session.user.id,
    },
  })

  return NextResponse.json(event, { status: 201 })
}
