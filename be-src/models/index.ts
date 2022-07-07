import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./Pet";
import { Report } from "./report";

Auth.belongsTo(User);
User.hasOne(Auth);

Pet.belongsTo(User);
User.hasMany(Pet);

Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Auth, Pet, Report };
