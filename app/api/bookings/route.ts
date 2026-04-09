import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

const bookingSchema = z.object({
  eventId: z.string().min(3),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = bookingSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const event = await prisma.event.findUnique({
    where: { id: parsed.data.eventId },
    include: { _count: { select: { bookings: true } } },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  if (event._count.bookings + parsed.data.quantity > event.maxCapacity) {
    return NextResponse.json({ error: "Event sold out" }, { status: 409 })
  }

  const booking = await prisma.booking.create({
    data: {
      bookingCode: uuidv4(),
      quantity: parsed.data.quantity,
      userId: session.user.id,
      eventId: parsed.data.eventId,
    },
  })

  return NextResponse.json(booking, { status: 201 })
}
