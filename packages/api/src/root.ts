import { spellRouter } from "./router/spell";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  spell: spellRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
