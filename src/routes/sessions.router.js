import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { UserDTO } from "../dao/dtos/user.dto.js";

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign({ id: user._id }, "tu_secreto_jwt", {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, { httpOnly: true });
  res.json({ message: "Login exitoso", user });
});



router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({ user: userDTO });
  }
);

export default router;