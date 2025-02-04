import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["jwt"];
      }
      return token;
    },
  ]),
  secretOrKey: "Admin123", // Cambia esto por una clave secreta segura
};

// Estrategia JWT
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Estrategia "current" para extraer el usuario del token
passport.use(
  "current",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);