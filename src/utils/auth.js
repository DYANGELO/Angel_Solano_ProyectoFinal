import jwt from "jsonwebtoken";
import passport from "passport";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET, 
    { expiresIn: "1h" } 
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verifica y decodifica el token
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};

export const isAuthenticated = passport.authenticate("jwt", { session: false });


export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); 
  } else {
    res.status(403).json({ message: "Acceso denegado: se requiere rol de administrador" });
  }
};


export const isUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next(); // Permite el acceso si el usuario es normal
  } else {
    res.status(403).json({ message: "Acceso denegado: se requiere rol de usuario" });
  }
};


export const extractTokenFromCookies = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"]; 
  }
  return token;
};

export const handleAuthError = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "No autorizado" });
  } else {
    next(err);
  }
};