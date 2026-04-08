"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import type { Event } from "@/lib/data"

interface EventCardProps {
  event: Event
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const categoryColors: Record<string, string> = {
    "college-fest": "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
    workshop: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
    music: "bg-pink-500/10 text-pink-500 dark:bg-pink-500/20",
    comedy: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
    food: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/events/${event.id}`}>
        <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <Badge
              variant="secondary"
              className={`absolute left-3 top-3 ${categoryColors[event.category]}`}
            >
              {event.category.replace("-", " ")}
            </Badge>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-lg font-semibold text-foreground line-clamp-1">
                {event.title}
              </p>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formattedDate}</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{event.venue}, {event.city}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {event.price === 0 ? "Free" : `₹${event.price}`}
                </p>
                <p className="text-xs text-muted-foreground">{event.distance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
