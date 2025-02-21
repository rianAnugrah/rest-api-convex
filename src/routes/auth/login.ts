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
interface AuthRoutesOptions extends FastifyPluginOptions {
  client: ConvexHttpClient;
  api: typeof api;
}

export default async function authRoutes(
  fastify: FastifyInstance,
  opts: AuthRoutesOptions
) {
  const { client, api } = opts;

  fastify.post("/login", async (req: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    try {
      // Cari user berdasarkan username di database Convex
      const users = await client.query(api.users.getUserByUsername, {
        username,
      });

      if (!users || users.length === 0) {
        return reply.status(401).send({ message: "User not found" });
      }

      const user = users[0]; // Ambil user pertama yang cocok

      // Bandingin password yang di-hash dengan yang dikasih user
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return reply.status(401).send({ message: "Invalid password" });
      }

      // Generate JWT Token
      const token = fastify.jwt.sign({
        userId: user._id,
        username: user.username,
      });

      return reply.send({
        succes: true,
        message: "User logged in succesfully",
        data: {
          token: token,
          user: { id: user._id, username: user.username, email: user.email },
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
