import { sequelize } from "./models/conn";
import "./models";

// sequelize
//   .sync({ alter: true })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err.message, 999999);
//   });

sequelize
  .sync({ force: true })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err.message, 123456);
  });
