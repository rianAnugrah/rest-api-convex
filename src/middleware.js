export async function authMiddleware(request, reply) {
    try {
      // Cek dan verifikasi JWT
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  }
  