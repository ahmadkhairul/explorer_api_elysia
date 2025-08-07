import bcrypt from "bcrypt";

import { UserService } from "@/controllers/users/users.service";
import { returnNonSuccess, returnSuccess } from "@/helper/response";
import { currentUser } from "@/helper/utils";
import type { ContextLoginProps, ParamsProps } from "@/types/users";

const userService = new UserService();

export const login = async (ctx: ContextLoginProps) => {
  const { body, jwt } = ctx;
  try {
    const user = await userService.get(body as ParamsProps);
    if (!user[0]?.password) throw "error";

    const { password, ...rest } = user[0];

    const isMatch = await bcrypt.compare(body.password, password as string);
    if (!isMatch) throw "error";

    const token = await jwt.sign(rest, {
      exp: body.rememberMe ? "48h" : "2h",
    });
    return returnSuccess(ctx, 200, "login success", { ...rest, token });
  } catch (err) {
    console.log(err)
    return returnNonSuccess(ctx, 403, "username atau password salah");
  }
};

export const auth = async (ctx: ContextLoginProps) => {
  try {
    const user = await currentUser(ctx);
    return returnSuccess(ctx, 200, "auth success", { user });
  } catch (err) {
    console.log(err)
    return returnNonSuccess(ctx, 403, "Expired");
  }
};
