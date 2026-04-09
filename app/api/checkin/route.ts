import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const checkinSchema = z.object({
  bookingCode: z.string().min(4),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Organizer access required" }, { status: 403 })
  }

  const parsed = checkinSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { bookingCode: parsed.data.bookingCode },
    include: { event: true },
  })

  if (!booking) {
    return NextResponse.json({ error: "Invalid booking code" }, { status: 404 })
  }

  if (booking.event.organizerId !== session.user.id) {
    return NextResponse.json({ error: "Not your event" }, { status: 403 })
  }

  const checkedIn = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      checkedIn: true,
      checkedInAt: new Date(),
    },
  })

  return NextResponse.json(checkedIn)
}
