import { z } from "zod"

// User role enum
export const userRoleSchema = z.enum(["organizer", "attendee"])
export type UserRole = z.infer<typeof userRoleSchema>

// Booking status enum
export const bookingStatusSchema = z.enum(["paid", "pending"])
export type BookingStatus = z.infer<typeof bookingStatusSchema>

// Event creation schema
export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
  price: z.number().min(0, "Price cannot be negative"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  location_name: z.string().max(500, "Location name is too long").optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  total_slots: z.number().int().min(1, "Must have at least 1 slot"),
  image_url: z.string().url("Invalid image URL").optional(),
  category: z.string().max(100, "Category is too long").optional(),
})

export type CreateEventInput = z.infer<typeof createEventSchema>

// Event query schema (for fetching nearby events)
export const getEventsQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(0).max(50000).default(50), // radius in km, default 50km
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  category: z.string().optional(),
})

export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>

// Booking creation schema
export const createBookingSchema = z.object({
  event_id: z.string().uuid("Invalid event ID"),
  ticket_count: z.number().int().min(1, "Must book at least 1 ticket").max(10, "Maximum 10 tickets per booking"),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>

// User profile schema
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
  role: userRoleSchema,
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type UserProfile = z.infer<typeof userProfileSchema>

// Event schema
export const eventSchema = z.object({
  id: z.string().uuid(),
  creator_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  location_name: z.string().nullable(),
  date: z.string(),
  total_slots: z.number(),
  available_slots: z.number(),
  image_url: z.string().nullable(),
  category: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Event = z.infer<typeof eventSchema>

// Booking schema
export const bookingSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  ticket_count: z.number(),
  status: bookingStatusSchema,
  qr_code_hash: z.string().nullable(),
  ticket_id: z.string(),
  total_amount: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Booking = z.infer<typeof bookingSchema>
