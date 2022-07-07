import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize";

export class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    // bio: DataTypes.STRING,
    // url: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "user",
  }
);
