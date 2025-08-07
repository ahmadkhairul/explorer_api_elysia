import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";

import { users } from "@/controllers/users/users.schema";
import { db } from "@/db/db";
import { type BodyProps, type ParamsProps } from "@/types/users";

export class UserService {
  params?: ParamsProps;
  body?: BodyProps;

  constructor(params?: ParamsProps, body?: BodyProps) {
    this.params = params;
    this.body = body;
  }

  async get(params?: ParamsProps) {
    return await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        role: users.role,
        ...(params?.password && { password: users.password }),
      })
      .from(users)
      .where(
        and(
          params?.id !== undefined
            ? eq(users.id, Number(params.id))
            : undefined,
          params?.name !== undefined ? eq(users.name, params.name) : undefined,
          params?.username !== undefined
            ? eq(users.username, params.username)
            : undefined,
        ),
      );
  }

  async create(body: BodyProps) {
    const { name, username, password, email, role } = body;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    return await db
      .insert(users)
      .values({
        name,
        username,
        password: hashedPassword,
        email,
        role,
      })
      .returning();
  }

  async update(params: ParamsProps, body: BodyProps) {
    const { id } = params;
    const { name, username, password, email, role } = body;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    return await db
      .update(users)
      .set({
        name,
        username,
        password: hashedPassword,
        email,
        role,
      })
      .where(eq(users.id, Number(id)))
      .returning();
  }

  async delete(params: ParamsProps) {
    return await db
      .update(users)
      .set({ deleted_at: new Date() })
      .where(eq(users.id, Number(params.id)))
      .returning();
  }
}
