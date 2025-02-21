import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Definisikan tipe untuk opsi yang akan diterima oleh plugin
interface TasksRoutesOptions extends FastifyPluginOptions {
  client: ConvexHttpClient;
  api: typeof api;
}

export default async function tasksRoutes(
  fastify: FastifyInstance,
  opts: TasksRoutesOptions
) {
  const { client, api } = opts;

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tasks = await client.query(api.tasks.get);
      console.log(tasks); // log untuk debugging
      return {
        message: "Hello, authorized user!",
        data: { tasks },
        user: request.user,
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
