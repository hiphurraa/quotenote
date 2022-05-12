import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtAuth = {};

// Create new access token and refresh token
jwtAuth.createTokens = (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "350d",
  });
  const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  return { accessToken, refreshToken };
};

//Check if access token is valid
jwtAuth.checkAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[0];
  if (token == null) return res.status(401).send({ title: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .send({ title: "You need to be logged in to do this." });
    req.user = user;
    next();
  });
};

jwtAuth.addUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[0];
  if (token != null) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .send({ title: "You need to be logged in to do this." });
      req.user = user;
    });
  }
  next();
};

export default jwtAuth;
