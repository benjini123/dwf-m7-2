import { error } from "console";
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

  console.log(created);

  if (created) {
    console.log("created");
    const [authInstance, authCreated] = await Auth.findOrCreate({
      where: { user_id: userInstance.get("id") },
      defaults: {
        name,
        password: getSHA256ofString(password),
        email: userInstance.get("email"),
        userId: userInstance.get("id"),
      },
    });
  }

  return userInstance;
}

export async function getUser(email: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw "user does not exist";
  } else {
    return user;
  }
}
