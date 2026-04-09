import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border bg-card p-8 md:p-12">
          <p className="text-sm text-primary">HyperLocal</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">
            Find events happening near your campus and community.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Discover college fests, workshops, pop-ups and community gatherings. Create events, sell tickets, and check in attendees in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/events">Discover events</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/organizer/events/new">Create an event</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
