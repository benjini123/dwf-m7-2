import "dotenv/config";
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import * as bodyParser from "body-parser";

import {
  createUser,
  getUser,
  getUsers,
  updateUser,
} from "./controllers/users-controller";
import { createReport, getReports } from "./controllers/report-controller";
import { createToken } from "./controllers/auth-controller";
import { authMiddleware, reqBody } from "./controllers/authentication";
import {
  getGeoPets,
  createPet,
  getPets,
  getUserPets,
  deletePet,
  updatePet,
} from "./controllers/pets-controller";

const port = process.env.PORT || 5656;
const app = express();

app.use(
  bodyParser.json({
    limit: "60mb",
  })
);

app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.static("dist"));
app.use(cors());

//Get user
app.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  const user = await getUser(email);

  res.json(user);
});

//Get users
app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

//Update user
app.put("/user/update", reqBody, authMiddleware, async (req, res) => {
  const { name, password, email } = req.body;
  const updateRes = await updateUser(name, password, email);
  res.json(updateRes);
});

//Sign up
app.post("/auth", reqBody, async (req, res) => {
  const { name, password, email } = req.body;

  const auth = await createUser(name, password, email);

  res.json(auth);
});

//Sign in
app.post("/auth/token", reqBody, async (req, res) => {
  const { email, password } = req.body;

  const token = await createToken(email, password);

  res.json(token);
});

//Post pet with geoloc
app.post("/mascotas", reqBody, authMiddleware, async (req, res) => {
  const { latitud, longitud } = req.body;

  if (latitud && longitud) {
    const pet = await createPet(req.body);
    res.json(pet);
  } else {
    res.status(400).json({
      error: "debes agregar una ubicacion para dar de alta a esta mascota",
    });
  }
});

//Update pet
app.put(
  "/mascotas/editar/:petId",
  authMiddleware,
  reqBody,
  async (req, res) => {
    const { petId } = req.params;

    const pet = await updatePet(req.body, petId);
    res.json(pet);
  }
);

//Get Pets
app.get("/mascotas", authMiddleware, async (req, res) => {
  const mascotas = await getPets();

  res.json(mascotas);
});

//get Pet by ID
app.get("/mascotas/:userId", async (req, res) => {
  const { userId } = req.params;

  const reportadas = await getUserPets(userId);

  res.json(reportadas);
});

//Get Pets near location
app.get("/mascotas-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const petsByLoc = await getGeoPets(lat, lng);
    res.json(petsByLoc);
  } catch (error) {
    throw error.message;
  }
});

//Delete Pet
app.delete("/mascotas/:petId", authMiddleware, async (req, res) => {
  const { petId } = req.params;

  const mascotas = await deletePet(petId);

  res.status(200).json({ success: "pet successfully removed from database" });
});

//Create Report
app.post("/report", async (req, res) => {
  const reportadas = await createReport(req.body).catch((err) => {
    res.json(err.message);
  });

  res.json(reportadas);
});

app.get("/me", authMiddleware, async (req, res, next) => {
  res.json({ token: "valido" });
});

app.use(express.static(path.resolve(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
