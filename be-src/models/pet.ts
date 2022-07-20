import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Pet extends Model {}
Pet.init(
  {
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    url: DataTypes.STRING,
    location: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "pet",
  }
);
