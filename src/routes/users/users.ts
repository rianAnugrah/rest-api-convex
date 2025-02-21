import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";

import { ConvexHttpClient } from "convex/browser";
// import { api } from "../../convex/_generated/api";
import { api } from "@/convex/_generated/api";
import { authMiddleware } from "@/src/middleware";

import crypto from "crypto";

// Definisikan tipe untuk opsi yang akan diterima oleh plugin
interface UsersRoutesOptions extends FastifyPluginOptions {
  client: ConvexHttpClient;
  api: typeof api;
}

export default async function usersRoutes(
  fastify: FastifyInstance,
  opts: UsersRoutesOptions
) {
  const { client, api } = opts;

  // Endpoint untuk register user
  fastify.post(
    "/",
    { preHandler: authMiddleware },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { username, password, email } = req.body as {
        username: string;
        password: string;
        email: string;
      };

      try {
        const newUser = await client.mutation(api.users.registerUser, {
          username,
          password,
          email,
        });
        console.log(newUser);
        return { message: "User registered successfully", user: newUser };
      } catch (error) {
        console.error("Error registering user:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  // Endpoint untuk mendapatkan semua user
  fastify.get(
    "/",
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const users = await client.query(api.users.getAllUsers);
        console.log(users); // log untuk debugging
        return {
          message: "Hello, authorized user!",
          data: { users },
          user: request.user,
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  fastify.post(
    "/hash",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { password, hash } = request.body as {
        password: string;
        hash: string;
      };
  
      const hashSHA256 = (password: string): string => {
        return crypto.createHash("sha256").update(password).digest("hex");
      };
  
      const hashedPassword = hashSHA256(password); // Panggil fungsi untuk mendapatkan hash
  
      const hashedPasswordVerified = hash === hashedPassword; // Verifikasi hash dengan hash yang dikirim
  
      if (!hashedPasswordVerified) {
        return reply.status(401).send({
          message: "Password is incorrect",
        });
      } else {
        reply.status(200).send({
          message: "Password is correct",
          data: { password: password, encrypted: hashedPassword },
        });
      }

     
    }
  );
  
}
