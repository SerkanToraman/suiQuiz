import { router, publicProcedure } from "../trpc";

export const apiRouter = router({
  getData: publicProcedure.query(() => {
    return { message: "API is working!" };
  }),
});
