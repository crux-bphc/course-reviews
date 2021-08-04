import passport from "passport";
import express from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { getUser, saveUser } from "./sql";
import { User } from "./types";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: User, done) {
  done(null, user);
});

function initializePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.LOGIN_CALLBACK as string,
      },
      async function (_accessToken, _refreshToken, profile, cb) {
        const user: User = {
          email: profile._json.email,
          google_id: profile._json.sub,
          name: profile._json.name,
          photo: profile._json.picture,
          admin: 0,
        };

        if (!user.email.endsWith("bits-pilani.ac.in")) {
          cb(null, undefined, { message: "Invalid email" });
        }

        if ((await getUser(user.email)) === undefined) {
          await saveUser(user);
        }

        return cb(null, user);
      }
    )
  );
}

export function auth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.user === undefined) {
    console.log("Setting baseurl", req.originalUrl);
    req.session.redirect = req.originalUrl;
    res.redirect(`/auth/google`);
  } else {
    next();
  }
}

export default initializePassport;
