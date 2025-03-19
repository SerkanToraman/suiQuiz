import { router, publicProcedure } from "../../trpc.ts";
import { z } from "zod";
import { observable } from "@trpc/server/observable";
import {
  getUserById,
  subscribeToNewUsers,
  createUser,
} from "./user.controller.ts"; // ✅ Import controller functions

export const userRouter = router({
  // ✅ Get User by ID (Uses Controller)
  getUserById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => getUserById(input)),

  // ✅ WebSocket Subscription for New Users (Uses Controller)
  onNewUser: publicProcedure.subscription(() => {
    return observable((emit) => {
      console.log("📡 Subscribing client to new users...");

      // ✅ Use the Controller for Subscription Logic
      const unsubscribe = subscribeToNewUsers((user) => {
        console.log("🔥 Sending new user to client:", user);
        emit.next(user);
      });

      return unsubscribe; // ✅ Clean up when client disconnects
    });
  }),

  // ✅ Create User (Uses Controller)
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      })
    )
    .mutation(async ({ input }) => createUser(input.name, input.bio)),
});
