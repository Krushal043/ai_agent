import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["data"];

export enum MeetingStatus {
  Upcoming = "upcoming",
  Completed = "completed",
  Active = "active",
  Cancelled = "cancelled",
  Processing = "processing",
}
