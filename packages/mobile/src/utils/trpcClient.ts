import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import superjson from "superjson";
import { serverConfig } from "../../../../config.ts";
import type { AppRouter } from "../../../server/router/index.ts";
import "./polyfill.ts";

// ✅ Use your actual local IP instead of `localhost` for mobile apps
const { port, prefix } = serverConfig;
const urlEnd = `localhost:${port}${prefix}`;

// ✅ Initialize WebSocket Client for Subscriptions
const wsClient = createWSClient({ url: `ws://${urlEnd}` });

// ✅ Initialize tRPC Client
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({ client: wsClient }),
      false: httpBatchLink({ url: `http://${urlEnd}` }),
    }),
  ],
});

// ✅ Debugging: Check if `trpc` is available
console.log("✅ tRPC Client Initialized");
