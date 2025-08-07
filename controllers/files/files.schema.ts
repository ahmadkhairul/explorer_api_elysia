import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id"),
  name: varchar("name", { length: 255 }).notNull(),
  type: text("type").$type<"folder" | "file">().notNull(),
  parent_id: integer("parent_id"),
  size: integer("size").default(0),
  path: varchar("path", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
