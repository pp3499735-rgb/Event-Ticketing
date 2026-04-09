import { PrismaClient, EventCategory, Role } from "@prisma/client"

const prisma = new PrismaClient()

const sampleEvents = [
  {
    title: "Campus Tech Fest 2026",
    description:
      "A 2-day inter-college tech fest with hackathons, robotics and startup demos.",
    address: "Innovation Block, State University",
    city: "San Francisco",
    latitude: 37.7749,
    longitude: -122.4194,
    startsAt: new Date("2026-05-02T10:00:00.000Z"),
    endsAt: new Date("2026-05-02T18:00:00.000Z"),
    ticketPrice: 25,
    maxCapacity: 500,
    category: EventCategory.TECH,
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Neighborhood Pop-up Market",
    description:
      "Local artists, handmade goods, and indie food stalls in a family-friendly open-air market.",
    address: "Mission Community Park",
    city: "San Francisco",
    latitude: 37.7599,
    longitude: -122.4148,
    startsAt: new Date("2026-04-20T16:00:00.000Z"),
    ticketPrice: 0,
    maxCapacity: 300,
    category: EventCategory.POPUP,
    imageUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "College Spring Music Night",
    description:
      "Live student bands, guest indie artists, and food trucks. Bring your friends.",
    address: "Central Lawn, Bay City College",
    city: "Oakland",
    latitude: 37.8044,
    longitude: -122.2712,
    startsAt: new Date("2026-05-10T19:00:00.000Z"),
    ticketPrice: 18,
    maxCapacity: 700,
    category: EventCategory.MUSIC,
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
]

async function main() {
  await prisma.booking.deleteMany()
  await prisma.event.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  const organizer = await prisma.user.create({
    data: {
      name: "HyperLocal Organizer",
      email: "organizer@hyperlocal.dev",
      role: Role.ORGANIZER,
      city: "San Francisco",
      latitude: 37.7749,
      longitude: -122.4194,
    },
  })

  const attendee = await prisma.user.create({
    data: {
      name: "HyperLocal Attendee",
      email: "attendee@hyperlocal.dev",
      role: Role.ATTENDEE,
      city: "Oakland",
      latitude: 37.8044,
      longitude: -122.2712,
    },
  })

  for (const event of sampleEvents) {
    await prisma.event.create({
      data: {
        ...event,
        organizerId: organizer.id,
      },
    })
  }

  console.log("Seeded users:", { organizer: organizer.email, attendee: attendee.email })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
