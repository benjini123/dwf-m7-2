import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { Auth } from "../models";
import "dotenv/config";

export function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function createToken(email: string, password: string) {
  const passwordHasheado = getSHA256ofString(password);

  const auth: any = await Auth.findOne({
    where: { email, password: passwordHasheado },
  });

  if (auth) {
    const token = jwt.sign({ id: auth.get("userId") }, process.env.SECRET);
    return token;
  } else {
    return false;
  }
}
