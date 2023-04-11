import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const spellRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.spell.findMany({ orderBy: { id: "desc" } });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.spell.findFirst({ where: { id: +input.id } });
    }),
  // create: publicProcedure
  //   .input(
  //     z.object({
  //       title: z.string().min(1),
  //       content: z.string().min(1),
  //     }),
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.post.create({ data: input });
  //   }),
  // delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //   return ctx.prisma.post.delete({ where: { id: input } });
  // }),
});
