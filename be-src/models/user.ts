import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    // bio: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "user",
  }
);
