import type { Context } from "elysia";

import { FileService } from "@/controllers/files/files.service";
import { responseFormat } from "@/helper/response";
import saveFile from "@/helper/upload";
import { currentUser, randStr } from "@/helper/utils";
import type { BodyProps, CreateProps } from "@/types/files";

const fileService = new FileService();

export const findFiles = async (ctx: Context) => {
  const { id } = await currentUser(ctx);
  const { params } = ctx;
  return responseFormat(
    fileService.findOne(Number(params.id), Number(id)),
    ctx,
  );
};

export const getFiles = async (ctx: Context) => {
  const { id } = await currentUser(ctx);
  const { query, params } = ctx;
  return responseFormat(
    fileService.get(query, { ...params, user_id: id }),
    ctx,
  );
};

export const createFiles = async (ctx: Context<{ body: CreateProps }>) => {
  const { id } = await currentUser(ctx);
  // file for file, name for creating folder

  const file = ctx.body?.file;
  const parent_id = ctx.body?.parent_id;
  let name = ctx.body?.name;

  let filePath = null;
  let size = 0;
  let type = "folder";
  // as default with no file saving as folder, is there file name will be unused and use file name instead
  if (file) {
    const saveName = randStr(5) + file.name;
    filePath = await saveFile(saveName, file);
    size = file.size;
    name = file.name;
    type = "file";
  }

  const data = {
    name,
    type,
    parent_id,
    size,
    path: filePath,
    user_id: id,
  } as BodyProps;

  return responseFormat(fileService.create(data), ctx);
};

export const updateFiles = async (ctx: Context) => {
  const { id } = await currentUser(ctx);
  const { body, params } = ctx;
  return responseFormat(
    fileService.update({ ...params, user_id: id }, body as BodyProps),
    ctx,
  );
};

export const deleteFiles = async (ctx: Context) => {
  const { id } = await currentUser(ctx);
  const { params } = ctx;
  return responseFormat(fileService.delete({ ...params, user_id: id }), ctx);
};
