import { Context } from "elysia";
// @ts-ignore
export const currentUser = async ({ jwt, headers }: Context) => {
  return await jwt.verify(headers?.authorization?.split(" ")[1]);
};

export function randStr(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
