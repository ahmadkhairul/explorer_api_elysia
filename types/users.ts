import { type Context, t } from "elysia";

export interface BodyProps {
  name: string;
  username: string;
  password: string;
  email: string;
  role: "admin" | "user";
}

export interface LoginProps {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface ParamsProps {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  name?: string;
}

export const bodySchema = {
  body: t.Object({
    name: t.String(),
    username: t.String(),
    password: t.String(),
    email: t.String(),
  }),
};

export type JWTContext = {
  sign: (payload: any, custom: any) => Promise<string>;
  verify: (token: string) => Promise<any>;
};

export interface ContextLoginProps extends Context {
  body: LoginProps;
  jwt: JWTContext;
}
