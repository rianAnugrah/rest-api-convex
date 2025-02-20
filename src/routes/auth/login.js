
export default async function authRoutes(fastify, opts) {
  const { client ,api } = opts;

  fastify.post("/login", async (req, reply) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "password") {
      const token = fastify.jwt.sign({ username });
      return reply.send({ token });
    }

    console.log(username, password);
    return reply.status(401).send({ message: "Unauthorized" });
  });
}
