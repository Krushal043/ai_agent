import { createTRPCRouter } from "@/trpc/init";
import { agentRouter } from "@/modules/agents/server/procedures";
import { meetingRouter } from "@/modules/meetings/server/procedures";

export const appRouter = createTRPCRouter({
  agents: agentRouter,
  meetings: meetingRouter,
});

export type AppRouter = typeof appRouter;
