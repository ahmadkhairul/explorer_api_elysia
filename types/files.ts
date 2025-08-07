import { t } from "elysia";

export interface QueryProps {
  all?: boolean;
  name?: string;
  type?: string;
}
export interface BodyProps {
  name: string;
  type: "folder" | "file";
  file: File;
  user_id: number;
  path: string;
  parent_id: number | string;
  size: number;
}

export interface ParamsProps {
  id?: number;
  user_id: number;
  parent_id?: number;
}

export interface CreateProps {
  name?: string;
  file?: File;
  parent_id?: number | string;
}

export const bodySchema = {
  body: t.Object({
    name: t.Optional(t.String()),
    file: t.Optional(t.File()),
    parent_id: t.Optional(t.String()),
  }),
};

export const bodyEditSchema = {
  body: t.Object({
    name: t.String(),
    parent_id: t.Optional(t.String()),
  }),
};

export const querySchema = {
  query: {
    name: t.String(),
    type: t.Union([t.Literal("folder"), t.Literal("file")]),
  },
};
