import { type CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

/**
 * Context creation function for tRPC
 * This function extracts user information from request headers
 */
export function createContext({ req, res }: CreateFastifyContextOptions) {
  // Extract user data from headers (extend this for real authentication)
  const user = {
    name: req.headers["username"] ?? "anonymous",
  };

  return { req, res, user };
}

// Export the context type for type safety
export type Context = Awaited<ReturnType<typeof createContext>>;
