import { error } from "console";
import { where } from "sequelize/types";
import { User, Auth } from "../models";
import { getSHA256ofString } from "./auth-controller";

export async function createUser(
  name: string,
  password: string,
  email: string
) {
  if (!name) {
    throw "you must insert a name";
  }

  const [userInstance, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      email,
      name,
    },
  });

  const userId = userInstance.get("id");

  if (created) {
    const [authInstance, authCreated] = await Auth.findOrCreate({
      where: { userId: userInstance.get("id") },
      defaults: {
        email,
        password: getSHA256ofString(password),
        userId: userId,
      },
    });
  } else {
    const userUpdate = await User.upsert({ id: userId, email, name });
    const authUpdate = await Auth.upsert({
      id: userId,
      email,
      password: getSHA256ofString(password),
    });
  }

  return userId;
}

export async function getUser(email: string) {
  const user = await User.findOne({ where: { email } });
  if (user) {
    const userId = user.get("id");
    return { userId };
  } else {
    return false;
  }
}

export async function getUsers() {
  const users = await User.findAll();
  return users;
}
