import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
// Import routes
import authRoutes from "./routes/auth/login";
import registerRoutes from "./routes/auth/register";
import tasksRoutes from "./routes/tasks/tasks";
import usersRoutes from "./routes/users/users";
import articleRoutes from "./routes/articles/articles";

dotenv.config({ path: ".env.local" });

// Pastikan ENV variabel tidak undefined
const CONVEX_URL = process.env.CONVEX_URL;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

if (!CONVEX_URL) {
  throw new Error("CONVEX_URL is not defined in environment variables.");
}

// Inisialisasi Convex Client
const client = new ConvexHttpClient(CONVEX_URL);

// Inisialisasi Fastify
const fastify: FastifyInstance = Fastify({ logger: true });

// Registrasi plugin Fastify JWT
fastify.register(fastifyJwt, {
  secret: JWT_SECRET,
});

// Registrasi plugin CORS
fastify.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Registrasi routes dengan tipe
fastify.register(authRoutes, { api, client, prefix: "/auth" });
fastify.register(registerRoutes, { api, client, prefix: "/auth" });
fastify.register(tasksRoutes, { api, client, prefix: "/tasks" });
fastify.register(usersRoutes, { api, client, prefix: "/users" });
fastify.register(articleRoutes, { api, client, prefix: "/articles" });

// Jalankan server
const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
