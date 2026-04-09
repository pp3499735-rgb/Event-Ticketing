import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const [bookings, events] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
    session.user.role === "ORGANIZER"
      ? prisma.event.findMany({
          where: { organizerId: session.user.id },
          include: { bookings: { include: { user: true } } },
          orderBy: { startsAt: "asc" },
        })
      : Promise.resolve([]),
  ])

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Role: {session.user.role}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>My booked tickets</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {bookings.length === 0 ? <p>No bookings yet.</p> : bookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border p-3">
                  <p className="font-medium">{booking.event.title}</p>
                  <p>{new Date(booking.event.startsAt).toLocaleString()}</p>
                  <p>Code: {booking.bookingCode}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {session.user.role === "ORGANIZER" && (
            <Card>
              <CardHeader><CardTitle>Organizer panel</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {events.length === 0 ? <p>No events created yet.</p> : events.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <p className="font-medium">{event.title}</p>
                    <p>{event.bookings.length} bookings</p>
                    <p className="text-muted-foreground">Attendees</p>
                    {event.bookings.slice(0, 5).map((booking) => (
                      <p key={booking.id}>• {booking.user.name ?? booking.user.email} ({booking.checkedIn ? "Checked in" : "Not checked in"})</p>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
