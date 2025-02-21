import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Cek apakah username sudah ada
export const checkUserExists = query({
  args: { username: v.string() },
  handler: async ({ db }, { username }) => {
    const user = await db
      .query('users')
      .filter((q) => q.eq(q.field('username'), username))
      .first();
    return !!user;
  },
});

export const getUserByUsername = query(async ({ db }, { username }) => {
  return await db.query("users").withIndex("by_username", (q) => q.eq("username", username)).collect();
});

// Register user baru
export const registerUser = mutation({
  args: { username: v.string(), passwordHash: v.string(), email: v.string() },
  handler: async ({ db }, { username, passwordHash , email }) => {
    const existingUser = await db
      .query('users')
      .filter((q) => q.eq(q.field('username'), username))
      .first();

    if (existingUser) {
      throw new Error('Username already exists');
    }

    return await db.insert('users', {
      username,
      email,
      passwordHash, // NOTE: Di real world, password harus di-hash!
      createdAt: Date.now(),
    });
  },
});


// Ambil semua data users
export const getAllUsers = query({
  args: { },
  handler: async ({ db }) => {
    const users = await db
      .query('users')
      .collect();;
    return users;
  },
});