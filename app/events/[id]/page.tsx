import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { BookingForm } from "@/components/events/booking-form"

async function getEvent(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/events/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) notFound()

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border bg-card p-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="mt-2 text-muted-foreground">{event.description}</p>
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>When:</strong> {new Date(event.startsAt).toLocaleString()}</p>
            <p><strong>Where:</strong> {event.address}, {event.city}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Price:</strong> {event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice}`}</p>
            <p><strong>Capacity:</strong> {event._count.bookings}/{event.maxCapacity}</p>
          </div>
        </section>
        <aside>
          <BookingForm eventId={event.id} />
        </aside>
      </main>
    </div>
  )
}
