import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";
import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
// Import routes
import authRoutes from "./routes/auth/login.js";
import registerRoutes from "./routes/auth/register.js";
import tasksRoutes from "./routes/tasks/tasks.js";
import usersRoutes from "./routes/users/users.js";

dotenv.config({ path: ".env.local" });

// Inisialisasi Convex Client
const client = new ConvexHttpClient(process.env["CONVEX_URL"]);

// Inisialisasi Fastify
const fastify = Fastify({ logger: true });

// Registrasi plugin Fastify JWT
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

// Registrasi plugin CORS
fastify.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});


// Registrasi routes
fastify.register(authRoutes, { api,client, prefix: "/auth" });
fastify.register(registerRoutes, { api,client, prefix: "/auth" });
fastify.register(tasksRoutes, { api,client, prefix: "/tasks" });
fastify.register(usersRoutes, {api, client, prefix : '/users'})

// Jalankan server
try {
  await fastify.listen({ port: 3000 });
  console.log("Server running at http://localhost:3000");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

