import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    user: v.id("users"),
  }),


  users: defineTable({
    username: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
    tokenIdentifier: v.optional(v.string()),
  }).index("by_username", ["username"]),

  articles: defineTable({
    id: v.number(),
    title: v.string(),
    type: v.string(),
    image: v.string(),
    date: v.number(),
    description:v.string(),
    slug: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    category: v.array(v.string()),
    authorIds: v.number(),
    status: v.string(),
    approvedBy :v.number(),
    approvedAt: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    views : v.number(),
  }).index("by_title", ["title"]),

  images: defineTable({
    id: v.number(),
    title: v.string(),
    url: v.string(),
    alt:  v.string(),
  }),

  category: defineTable({
    id: v.number(),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  }),

  tags: defineTable({
    id: v.number(),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  }),


  stats : defineTable({
    id: v.number(),
    views : v.number(),
    viewType : v.string(),
    viewURL : v.string(),
    date : v.number(),
    ipAddress : v.string(),
    geolocation : v.string(),
  }),

  analytics: defineTable({
    page_url: v.string(), // Halaman yang dikunjungi
    page_id: v.string(),
    page_slug: v.string(),
    page_authodIds: v.string(),
    referrer: v.string(), // Sumber traffic
    timestamp: v.string(), // Waktu akses
    sessionId: v.string(), // Session ID buat tracking sesi user
    device: v.string(), // Device type (mobile/desktop)
    os: v.string(), // Sistem operasi
    browser: v.string(), // Browser yang dipake
    country: v.optional(v.string()), // Negara asal akses (kalau ada API IP tracking)
    utm_source: v.optional(v.string()), // UTM tracking (sumber campaign)
    utm_medium: v.optional(v.string()), // Jenis campaign
    utm_campaign: v.optional(v.string()), // Nama campaign
    reading_time: v.optional(v.number()), // Lama baca artikel (dalam detik)
    scroll_depth: v.optional(v.number()), // Seberapa jauh user scroll (%)
    clicks: v.optional(v.number()), // Jumlah klik dalam artikel
  }).index("by_page", ["page_id", "timestamp"]), // Index buat query per halaman
});