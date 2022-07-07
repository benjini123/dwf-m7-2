import * as express from "express";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as cors from "cors";
import * as path from "path";
import * as bodyParser from "body-parser";

import { index } from "./lib/algolia";
import { Pet, User, Auth, Report } from "./models/index";
import { createUser, getUser } from "./controllers/users-controller";
import { createToken } from "./controllers/auth-controller";
import { createPet } from "./controllers/pets-controller";

const port = process.env.PORT;
const app = express();

app.use(
  bodyParser.json({
    limit: "60mb",
  })
);

app.use(express.json());
app.use(cors());

//get user
app.post("/users", async (req, res) => {
  const { email } = req.body;

  const user = await getUser(email).catch((err) => {
    res.json(err.message);
  });

  res.json(user);
});

//get users
app.get("/users", async (req, res) => {
  const users = await User.findAll();

  res.json(users);
});

//create User
app.post("/auth", async (req, res) => {
  const { name, password, email } = req.body;

  const user = await createUser(name, password, email).catch((err) => {
    console.log("fallo el crear usuario", err.message);
    res.json(err.message);
  });

  res.json(user);
});

//sign in
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;

  const token = await createToken(email, password).catch((err) => {
    console.log({ error: err.message });
    res.status(400).send();
  });

  res.json(token);
});

//post pet with geoloc
app.post("/mascotas", async (req, res) => {
  const { latitud, longitud } = req.body;
  if (latitud && longitud) {
    console.log("llego el pet correctamente" + latitud + longitud);
    const pet = await createPet(req.body);
    res.json(pet);
  } else {
    res.status(400).json({
      error: "debes agregar una ubicacion para dar de alta a esta mascota",
    });
  }
});

app.get("/mascotas", async (req, res) => {
  const mascotas = await Pet.findAll();
  res.json(mascotas);
});

app.get("/mascotas/reportadas", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  const mascotas = await Pet.findOne({
    where: { user_id: user.get("user_id") },
  });
  res.json(mascotas);
});

app.get("/auth", async (req, res) => {
  const auth = await Auth.findAll();
  res.json(auth);
});

app.get("/mascotas-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 10000,
  });

  res.json(hits);
});

//authorization
function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, process.env.SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "not allowed" });
  }
}

app.get("/me", authMiddleware, async (req, res, next) => {
  res.json({ token: "valido" });
});

// app.get("*", express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
