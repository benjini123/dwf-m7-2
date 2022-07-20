import * as jwt from "jsonwebtoken";

//authorization
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, process.env.SECRET);
    next();
  } catch {
    res.status(401).json({ error: "not allowed" });
  }
}

//Body checker
export async function reqBody(req, res, next) {
  const hasValue =
    Object.values(req.body).filter((e) => {
      return e !== "";
    }).length >= 1;

  if (hasValue) {
    next();
  } else {
    res.status(401).send({ error: "No hay body" });
  }
}
