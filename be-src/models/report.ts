import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Report extends Model {}
Report.init(
  {
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    phone: DataTypes.BIGINT,
  },
  {
    sequelize,
    modelName: "report",
  }
);
