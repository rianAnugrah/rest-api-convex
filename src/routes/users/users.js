
import { authMiddleware } from "../../middleware.js";


export default async function usersRoutes(fastify, opts) {
    const { client , api } = opts;
  
    fastify.post("/", { preHandler: authMiddleware }, async (req, reply) => {
      const { username, password, email } = req.body;
  
      try {
        const newUser = await client.mutation(api.users.registerUser, { username, password, email });
        console.log(newUser);
        return { message: "User registered successfully", user: newUser };
      } catch (error) {
        console.error("Error registering user:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    });

    fastify.get("/", { preHandler: authMiddleware }, async (request, reply) => {
      try {
        const users = await client.query(api.users.getAllUsers);
        console.log(users); // log untuk debugging
        return { message: "Hello, authorized user!", data: { users }, user: request.user };
      } catch (error) {
        console.error("Error fetching users:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    });
    
  }
  