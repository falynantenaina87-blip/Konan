import { GenericMutationCtx, GenericQueryCtx, GenericActionCtx } from "convex/server";

// These are just type markers or pass-throughs for the compilation to succeed
export const query = (args: any) => args as any;
export const mutation = (args: any) => args as any;
export const action = (args: any) => args as any;