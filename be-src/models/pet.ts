import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize";

export class Pet extends Model {}
Pet.init(
  {
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "pet",
  }
);
