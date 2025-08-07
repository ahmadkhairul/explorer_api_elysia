import { and, eq, ilike, inArray, isNull } from "drizzle-orm";

import { files } from "@/controllers/files/files.schema";
import { db } from "@/db/db";
import {
  type BodyProps,
  type ParamsProps,
  type QueryProps,
} from "@/types/files";

export class FileService {
  query?: QueryProps;
  params?: ParamsProps;
  body?: BodyProps;

  constructor(query?: QueryProps, params?: ParamsProps, body?: BodyProps) {
    this.query = query;
    this.params = params;
    this.body = body;
  }

  async findOne(id?: number, user_id?: number) {
    const [file] = await db
      .select()
      .from(files)
      .where(eq(files.id, Number(id)));

    if (!file) throw new Error("File not found");
    if (file.user_id !== user_id) throw new Error("Unauthorized");

    return file;
  }

  async get(query?: QueryProps, params?: ParamsProps) {
    const whereConditions = [
      // get by id
      params?.user_id !== undefined
        ? eq(files.user_id, Number(params.user_id))
        : undefined,

      // get all or get all by parent_id or get parent_id === null (root folder)
      query?.all
        ? undefined
        : params?.parent_id !== undefined
          ? eq(files.parent_id, Number(params.parent_id))
          : isNull(files.parent_id),

      // search by name
      query?.name ? ilike(files.name, `%${query.name}%`) : undefined,

      // filter by type
      query?.type ? ilike(files.type, `%${query.type}%`) : undefined,

      isNull(files.deleted_at),
    ].filter(Boolean);

    return await db
      .select({
        id: files.id,
        name: files.name,
        parent_id: files.parent_id,
        type: files.type,
        size: files.size,
        path: files.path,
      })
      .from(files)
      .where(and(...whereConditions));
  }

  async create(body: BodyProps) {
    const { name, type, parent_id, size, user_id, path } = body;

    return await db
      .insert(files)
      .values({
        name,
        type,
        path,
        user_id: Number(user_id),
        parent_id: parent_id ? Number(parent_id) : null,
        size,
      })
      .returning();
  }

  async update(params: ParamsProps, body: BodyProps) {
    const { id, user_id } = params;
    const { name, type, parent_id } = body;
    await this.findOne(id, user_id);

    return await db
      .update(files)
      .set({
        name,
        type,
        ...(parent_id && { parent_id: Number(parent_id) }),
      })
      .where(eq(files.id, Number(id)))
      .returning();
  }

  async delete(params: ParamsProps) {
    const { id, user_id } = params;

    await this.findOne(id, user_id);

    // 1. Get all id from all descendant
    const getDescendants = async (parentId: number): Promise<number[]> => {
      const children = await db
        .select({ id: files.id })
        .from(files)
        .where(and(eq(files.parent_id, parentId), isNull(files.deleted_at)));

      const childIds = children.map((c) => c.id);

      // 2. Rekursion get all id from all descendant
      for (const childId of childIds) {
        const grandChildren = await getDescendants(childId);
        childIds.push(...grandChildren);
      }

      return childIds;
    };

    // 3. Get files id and all of descendant
    const idsToDelete = [Number(id), ...(await getDescendants(Number(id)))];

    // 4. Soft delete all data
    return await db
      .update(files)
      .set({ deleted_at: new Date() })
      .where(inArray(files.id, idsToDelete))
      .returning();
  }
}
