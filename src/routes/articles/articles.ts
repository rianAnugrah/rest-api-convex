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

// Definisikan tipe untuk opsi yang akan diterima oleh plugin
interface UsersRoutesOptions extends FastifyPluginOptions {
  client: ConvexHttpClient;
  api: typeof api;
}

interface Article {
  id: number;
  title: string;
  type: string;
  image: string;
  date: number;
  slug: string;
  content: string;
  tags: string[];
  description: string;
  category: string[];
  authorIds: number;
  status: string;
  approvedBy: number;
  approvedAt: number;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  views: number;
}

export default async function articleRoutes(
  fastify: FastifyInstance,
  opts: UsersRoutesOptions
) {
  const { client, api } = opts;

  // Endpoint untuk register user
  fastify.post(
    "/",
    { preHandler: authMiddleware },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const {
        id,
        title,
        type,
        image,
        date,
        slug,
        content,
        tags,
        description,
        category,
        authorIds,
        status,
        approvedBy,
        approvedAt,
        isDeleted,
        createdAt,
        updatedAt,
        views,
      } = req.body as Article;

      try {
        const newArticle = await client.mutation(api.articles.addNewArticle, {
            id,
            title,
            type,
            image,
            date,
            slug,
            content,
            tags,
            description,
            category,
            authorIds,
            status,
            approvedBy,
            approvedAt,
            isDeleted,
            createdAt,
            updatedAt,
            views,
        });
        console.log(newArticle);
        return { message: "Article addedsuccessfully", article: newArticle };
      } catch (error) {
        console.error("Error adding article:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );


  fastify.get(
    "/",
    // { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const articles = await client.query(api.articles.getAllArticles);
        console.log(articles); // log untuk debugging
        return {
          success : true,
          message: "Articles get successfully",
          data: { articles },
        };
      } catch (error) {
        console.error("Error fetching articles:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
