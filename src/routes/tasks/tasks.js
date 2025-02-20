
import { authMiddleware } from "../../middleware.js";

export default async function tasksRoutes(fastify, opts) {
  const { client, api } = opts;

  fastify.get(
    "/",
    { preHandler: authMiddleware }, // Proteksi route dengan middleware
    async (request, reply) => {
      try {
        const tasks = await client.query(api.tasks.get);
        console.log(tasks); // log untuk debugging
        return { message: "Hello, authorized user!", data:{tasks : tasks}, user: request.user };
      } catch (error) {
        console.error("Error fetching tasks:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
