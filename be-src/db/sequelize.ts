import { Sequelize, Model, DataTypes } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "bpfyqizichwpid",
  password: "8b542e753d9c8939ffc75b83118cb8f675aeb90bc0f5a74f1c14c218055fc228",
  database: "ddui0qmrbvook1",
  port: 5432,
  host: "ec2-23-20-224-166.compute-1.amazonaws.com",
  ssl: true,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
