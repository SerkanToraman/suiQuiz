import { apiRouter } from "./routers/api";
import { userRouter } from "./routers/user/user.router";
import { router } from "./trpc";

export const appRouter = router({
  api: apiRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
