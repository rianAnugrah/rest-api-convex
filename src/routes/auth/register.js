export default async function registerRoutes(fastify, opts) {
    const { client , api } = opts;
  
    fastify.post("/register", async (req, reply) => {
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
  }
  