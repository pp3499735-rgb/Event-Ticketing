export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  city: string
  price: number
  image: string
  category: "college-fest" | "workshop" | "music" | "comedy" | "food"
  distance: string
  organizer: {
    name: string
    avatar: string
    verified: boolean
  }
  totalTickets: number
  soldTickets: number
  attendees: Attendee[]
}

export interface Attendee {
  id: string
  name: string
  email: string
  ticketCount: number
  bookingDate: string
  ticketId: string
}

export const events: Event[] = [
  {
    id: "1",
    title: "Techfest 2026",
    description: "The biggest college tech festival in Mumbai! Join us for 3 days of hackathons, workshops, robotics competitions, and tech talks from industry leaders. Experience cutting-edge technology, network with like-minded enthusiasts, and compete for prizes worth ₹10 lakhs.",
    date: "2026-04-25",
    time: "10:00 AM",
    venue: "IIT Bombay Campus",
    city: "Mumbai",
    price: 199,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    category: "college-fest",
    distance: "2.5 km",
    organizer: {
      name: "IIT Bombay Student Council",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      verified: true
    },
    totalTickets: 5000,
    soldTickets: 3247,
    attendees: [
      { id: "a1", name: "Rahul Sharma", email: "rahul@email.com", ticketCount: 2, bookingDate: "2026-04-10", ticketId: "TF2026-001" },
      { id: "a2", name: "Priya Patel", email: "priya@email.com", ticketCount: 1, bookingDate: "2026-04-11", ticketId: "TF2026-002" },
      { id: "a3", name: "Amit Kumar", email: "amit@email.com", ticketCount: 3, bookingDate: "2026-04-12", ticketId: "TF2026-003" },
    ]
  },
  {
    id: "2",
    title: "Indie Music Night",
    description: "A magical evening featuring the best indie artists from across India. Experience soul-stirring performances under the stars at this open-air concert. Food stalls, merchandise, and meet & greet opportunities included.",
    date: "2026-04-20",
    time: "6:00 PM",
    venue: "Diu Fort Amphitheatre",
    city: "Delhi",
    price: 499,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    category: "music",
    distance: "5.2 km",
    organizer: {
      name: "SoundWave Productions",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      verified: true
    },
    totalTickets: 2000,
    soldTickets: 1856,
    attendees: [
      { id: "b1", name: "Sneha Reddy", email: "sneha@email.com", ticketCount: 2, bookingDate: "2026-04-08", ticketId: "IMN2026-001" },
      { id: "b2", name: "Vikram Singh", email: "vikram@email.com", ticketCount: 4, bookingDate: "2026-04-09", ticketId: "IMN2026-002" },
    ]
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    description: "A hands-on workshop covering the fundamentals of user interface and user experience design. Learn Figma, prototyping, user research, and design thinking from industry professionals. Certificate provided.",
    date: "2026-04-18",
    time: "9:00 AM",
    venue: "WeWork Galaxy",
    city: "Bangalore",
    price: 999,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    category: "workshop",
    distance: "3.8 km",
    organizer: {
      name: "DesignHub Academy",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      verified: true
    },
    totalTickets: 100,
    soldTickets: 87,
    attendees: [
      { id: "c1", name: "Ananya Gupta", email: "ananya@email.com", ticketCount: 1, bookingDate: "2026-04-05", ticketId: "UXW2026-001" },
    ]
  },
  {
    id: "4",
    title: "Comedy Night Live",
    description: "Get ready to laugh till your stomach hurts! Featuring top stand-up comedians from the Indian comedy circuit. An evening of non-stop entertainment with surprise guest appearances.",
    date: "2026-04-22",
    time: "8:00 PM",
    venue: "Canvas Laugh Club",
    city: "Mumbai",
    price: 699,
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop",
    category: "comedy",
    distance: "1.2 km",
    organizer: {
      name: "LaughterBox Entertainment",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      verified: false
    },
    totalTickets: 300,
    soldTickets: 298,
    attendees: []
  },
  {
    id: "5",
    title: "Street Food Festival",
    description: "A culinary adventure featuring the best street food vendors from across India. Taste authentic flavors from different states, participate in cooking competitions, and enjoy live music throughout the day.",
    date: "2026-04-28",
    time: "11:00 AM",
    venue: "JLN Stadium Grounds",
    city: "Delhi",
    price: 99,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    category: "food",
    distance: "4.5 km",
    organizer: {
      name: "Foodie Collective",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      verified: true
    },
    totalTickets: 10000,
    soldTickets: 4521,
    attendees: []
  },
  {
    id: "6",
    title: "Rendezvous 2026",
    description: "IIT Delhi's annual cultural festival brings together art, music, dance, and drama. Featuring celebrity performances, competitions, exhibitions, and workshops. Three days of non-stop excitement!",
    date: "2026-05-02",
    time: "10:00 AM",
    venue: "IIT Delhi Campus",
    city: "Delhi",
    price: 299,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    category: "college-fest",
    distance: "6.1 km",
    organizer: {
      name: "IIT Delhi Cultural Council",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      verified: true
    },
    totalTickets: 8000,
    soldTickets: 2340,
    attendees: []
  },
  {
    id: "7",
    title: "Startup Pitch Night",
    description: "Watch promising startups pitch to top VCs and angel investors. Network with founders, investors, and industry experts. A great opportunity for aspiring entrepreneurs to learn and connect.",
    date: "2026-04-30",
    time: "5:00 PM",
    venue: "91springboard",
    city: "Bangalore",
    price: 149,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
    category: "workshop",
    distance: "2.8 km",
    organizer: {
      name: "StartupBLR",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
      verified: true
    },
    totalTickets: 200,
    soldTickets: 156,
    attendees: []
  },
  {
    id: "8",
    title: "EDM Rave Party",
    description: "Dance the night away with international DJs spinning the hottest EDM tracks. State-of-the-art sound system, stunning visuals, and an electrifying atmosphere. Age 21+ only.",
    date: "2026-05-05",
    time: "9:00 PM",
    venue: "Phoenix Marketcity",
    city: "Mumbai",
    price: 1499,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
    category: "music",
    distance: "8.3 km",
    organizer: {
      name: "NightOwl Events",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop",
      verified: true
    },
    totalTickets: 1500,
    soldTickets: 1203,
    attendees: []
  }
]

export const categories = [
  { id: "all", label: "All Events", icon: "Sparkles" },
  { id: "college-fest", label: "College Fests", icon: "GraduationCap" },
  { id: "workshop", label: "Workshops", icon: "Lightbulb" },
  { id: "music", label: "Music", icon: "Music" },
  { id: "comedy", label: "Comedy", icon: "Laugh" },
  { id: "food", label: "Food & Drinks", icon: "UtensilsCrossed" },
] as const

export const cities = ["All Cities", "Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"]
