import createError from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import logger from "morgan";

import initializePassport from "./initializePassport";

import indexRouter from "./routes/index";
import adminRouter from "./routes/admin";
import courseRouter from "./routes/course";
import usersRouter from "./routes/users";
import passport from "passport";
import { User } from "./types";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

declare module "express-session" {
  interface SessionData {
    user: User;
    redirect: string | undefined;
  }
}

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(["/course", "/courses"], courseRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.use("/admin", enforceAdmin, adminRouter);

app.get("/policy", function (req, res) {
  res.render("policy");
});

app.get("/auth/google/logout", function (req, res) {
  req.user = undefined;
  req.logout();
  res.redirect("/");
});

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-failed" }),
  function (req, res) {
    if (req.session.redirect) {
      res.redirect(req.session.redirect);
      req.session.redirect = undefined;
    } else {
      res.redirect("/courses");
    }
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: { message: any; status: any },
  req: { app: { get: (arg0: string) => string } },
  res: {
    locals: { message: any; error: any };
    status: (arg0: any) => void;
    render: (arg0: string) => void;
  },
  next: any
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function enforceAdmin(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  if (req.user?.admin) {
    return next();
  }

  res.end("You must be an admin.");
}

module.exports = app;
