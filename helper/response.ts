import type { Context } from "elysia";

export const responseFormat = async <T>(promise: Promise<T>, ctx: Context) => {
  try {
    const data = await promise;
    return returnSuccess(ctx, 200, "Success", data);
  } catch (error: unknown) {
    return returnNonSuccess(ctx, 500, (error as Error).message);
  }
};

export function returnSuccess(
  ctx: Context,
  statusCode: number,
  message: string,
  data: any,
) {
  const returnResponse = {
    status: "OK",
    message,
    data,
  };
  return (ctx.set.status = statusCode), returnResponse;
}

export function returnNonSuccess(
  ctx: Context,
  statusCode: number,
  message: string,
) {
  return (ctx.set.status = statusCode), { status: "ERROR", message };
}
