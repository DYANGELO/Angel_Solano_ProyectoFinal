import { UserService } from "../services/user.service.js";
import { generateToken } from "../utils/auth.js";

const userService = new UserService();

export const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await userService.login(req.body.email, req.body.password);
    const token = generateToken(user);
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const current = async (req, res) => {
  res.json({ user: req.user });
};