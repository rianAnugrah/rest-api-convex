import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Register user baru
export const addNewArticle = mutation({
  args: {
    id: v.number(),
    title: v.string(),
    type: v.string(),
    image: v.string(),
    date: v.number(),
    description: v.string(),
    slug: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    category: v.array(v.string()),
    authorIds: v.number(),
    status: v.string(),
    approvedBy: v.number(),
    approvedAt: v.number(),
    isDeleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    views: v.number(),
  },
  handler: async (
    { db },
    {
      id,
      title,
      type,
      image,
      date,
      slug,
      content,
      tags,
      description,
      category,
      authorIds,
      status,
      approvedBy,
      approvedAt,
      isDeleted,
      createdAt,
      updatedAt,
      views,
    }
  ) => {
    const existingArticle = await db
      .query("articles")
      .filter((q) => q.eq(q.field("id"), id))
      .first();

    if (existingArticle) {
      throw new Error("Article with this id already exists");
    }

    return await db.insert("articles", {
      id,
      title,
      type,
      image,
      date,
      slug,
      content,
      tags,
      description,
      category,
      authorIds: 0,
      status: "draft",
      approvedBy: 0,
      approvedAt: 0,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      views: 0,
    });
  },
});

export const getAllArticles = query({
  args: {},
  handler: async ({ db }) => {
    const articles = await db.query("articles").collect();
    return articles;
  },
});
