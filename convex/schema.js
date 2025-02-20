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
    password: v.string(),
    createdAt: v.number(),
    tokenIdentifier: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

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
  })

  
});