import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import bcrypt from "bcrypt";

// Definisikan tipe untuk opsi yang akan diterima oleh plugin
interface RegisterRoutesOptions extends FastifyPluginOptions {
  client: ConvexHttpClient;
  api: typeof api;
}

export default async function registerRoutes(
  fastify: FastifyInstance,
  opts: RegisterRoutesOptions
) {
  const { client, api } = opts;

  fastify.post(
    "/register",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { username, password, email } = req.body as {
        username: string;
        password: string;
        email: string;
      };

      try {
        // Cek apakah username sudah ada di database
        const existingUsers = await client.query(api.users.getUserByUsername, { username });
        if (existingUsers.length > 0) {
          return reply.status(400).send({ message: "Username already exists" });
        }

        // Hash password sebelum disimpan ke database
        const passwordHash = await bcrypt.hash(password, 10);

        // Simpan user baru dengan password yang sudah di-hash
        const newUser = await client.mutation(api.users.registerUser, {
          username,
          passwordHash, // Simpan hash, bukan password asli
          email,
        });

        console.log(newUser);
        return reply.send({ message: "User registered successfully", user: newUser });
      } catch (error) {
        console.error("Error registering user:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
