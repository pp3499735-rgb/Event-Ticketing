"use client"

import Link from "next/link"
import { GraduationCap, Lightbulb, Music, Laugh, UtensilsCrossed } from "lucide-react"
import { motion } from "framer-motion"

const categories = [
  {
    id: "college-fest",
    label: "College Fests",
    description: "Campus celebrations & competitions",
    icon: GraduationCap,
    color: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-blue-50",
  },
  {
    id: "workshop",
    label: "Workshops",
    description: "Learn new skills",
    icon: Lightbulb,
    color: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-amber-50",
  },
  {
    id: "music",
    label: "Music",
    description: "Concerts & live shows",
    icon: Music,
    color: "bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-pink-50",
  },
  {
    id: "comedy",
    label: "Comedy",
    description: "Stand-up & improv nights",
    icon: Laugh,
    color: "bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-orange-50",
  },
  {
    id: "food",
    label: "Food & Drinks",
    description: "Festivals & tastings",
    icon: UtensilsCrossed,
    color: "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-green-50",
  },
]

export function CategoriesSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find events that match your interests
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/events?category=${category.id}`}
                className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${category.color}`}
                >
                  <category.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold">{category.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
