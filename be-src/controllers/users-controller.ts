import { error } from "console";
import { where } from "sequelize/types";
import { User, Auth } from "../models";
import { getSHA256ofString } from "./auth-controller";

export async function createUser(
  name: string,
  password: string,
  email: string
) {
  const userInstance = await User.create({
    email,
    name,
  });

  const userId = userInstance.get("id");

  await Auth.create({
    email,
    password: getSHA256ofString(password),
    userId: userId,
  });

  return userId;
}

export async function updateUser(name, password, email) {
  const user = await User.findOne({
    where: { email },
  });

  await User.upsert({ id: user.get("id"), name });
  await Auth.upsert({ userId: user.get("id"), password });

  return true;
}

export async function getUser(email: string) {
  const user = await User.findOne({ where: { email } });
  if (user) {
    // const userId = user.get("id");

    return user;
  } else {
    return false;
  }
}

export async function getUsers() {
  const users = await User.findAll();
  return users;
}
