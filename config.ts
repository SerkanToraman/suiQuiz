import type { ServerOptions } from "./packages/server/server";

export const serverConfig: ServerOptions = {
  dev: false,
  port: 2022,
  prefix: "/trpc",
};
