import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";

import { auth, login } from "@/controllers/auth/auth.api";
import {
  createFiles,
  deleteFiles,
  findFiles,
  getFiles,
  updateFiles,
} from "@/controllers/files/files.api";
import {
  createUsers,
  deleteUsers,
  getUsers,
  updateUsers,
} from "@/controllers/users/users.api";
import { getAllowedOrigins } from "@/helper/origin";
import {
  bodyEditSchema as fileBodyEditSchema,
  bodySchema as fileBodySchema,
} from "@/types/files";
import { ContextLoginProps, bodySchema as userBodySchema } from "@/types/users";
import { basicAuth } from "@/helper/basic";

const app = new Elysia();

app.use(
  cors({
    origin: getAllowedOrigins(),
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  }),
);

app.use(
  jwt({
    name: "jwt",
    secret: process.env.APP_DATA_JWT_SECRET || "",
  }),
);

app.use(
  staticPlugin({
    prefix: "/uploads",
    assets: "./uploads",
  }),
);

app.post("/api/v1/login", (ctx: ContextLoginProps) => {
  const authResult = basicAuth(ctx);
  if (authResult) return authResult;

  return login(ctx); 
});

app.post("/api/v1/register", createUsers, userBodySchema);
app.group("/api/v1", (app) =>
  app
    // @ts-ignore
    .onBeforeHandle(async ({ jwt, headers, set }) => {
      try {
        const header = headers.authorization;
        if (!header || !header.startsWith("Bearer "))
          throw new Error("No token");

        const token = header.split(" ")[1];
        if (!token) throw new Error("Token invalid");

        const user = await jwt.verify(token);
        if (!user) throw new Error("Token invalid");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Forbidden";
        return (set.status = 401), { message };
      }
    })
    .get("/auth", auth)

    .get("/files", getFiles)
    .get("/files/:parent_id", getFiles)
    .get("/files/detail/:id", findFiles)
    .post("/files", createFiles, fileBodySchema)
    .put("/files/:id", updateFiles, fileBodyEditSchema)
    .delete("/files/:id", deleteFiles)

    .get("/user", getUsers)
    .put("/user", updateUsers, userBodySchema),
);

app.group("/api-admin/v1", (app) =>
  app
    // @ts-ignore
    .onBeforeHandle(async ({ jwt, headers, set }) => {
      try {
        const header = headers.authorization;
        if (!header || !header.startsWith("Bearer "))
          throw new Error("No token");

        const token = header.split(" ")[1];
        if (!token) throw new Error("Token invalid");

        const user = await jwt.verify(token);
        if (!user || (user && user.role !== "admin"))
          throw new Error("Token invalid");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Forbidden";
        return (set.status = 403), { message };
      }
    })
    .get("/users", getUsers)
    .get("/users/:id", getUsers)
    .delete("/users/:id", deleteUsers),
);

app.listen(process.env.APP_PORT || 3000, () =>
  console.log("Server running on http://localhost:3000"),
);
