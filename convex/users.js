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

// Register user baru
export const registerUser = mutation({
  args: { username: v.string(), password: v.string(), email: v.string() },
  handler: async ({ db }, { username, password , email }) => {
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
      password, // NOTE: Di real world, password harus di-hash!
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