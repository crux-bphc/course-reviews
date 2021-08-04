import express from "express";
import { auth } from "../initializePassport";
var router = express.Router();

/* GET users listing. */
router.get("/", auth, function (req, res, next) {
  res.send("respond with a resource");
});

export default router;
