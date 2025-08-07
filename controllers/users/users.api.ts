import type { Context } from "elysia";

import { UserService } from "@/controllers/users/users.service";
import { responseFormat } from "@/helper/response";
import type { BodyProps } from "@/types/users";

const userService = new UserService();

export const getUsers = async (ctx: Context) => {
  const { query } = ctx;
  return responseFormat(userService.get(query), ctx);
};

export const createUsers = async (ctx: Context) => {
  const { body } = ctx;
  return responseFormat(userService.create(body as BodyProps), ctx);
};

export const updateUsers = async (ctx: Context) => {
  const { body, params } = ctx;
  return responseFormat(userService.update(params, body as BodyProps), ctx);
};

export const deleteUsers = async (ctx: Context) => {
  const { params } = ctx;
  return responseFormat(userService.delete(params), ctx);
};
