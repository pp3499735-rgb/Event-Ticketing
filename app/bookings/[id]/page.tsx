import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"

export default async function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const { id } = await params
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { event: true },
  })

  if (!booking || booking.userId !== session.user.id) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-6">
          <h1 className="text-2xl font-bold">Booking confirmed 🎉</h1>
          <p className="mt-2 text-muted-foreground">Show this booking code at check-in.</p>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Booking Code:</strong> {booking.bookingCode}</p>
            <p><strong>Event:</strong> {booking.event.title}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
