import express from "express";
import { auth } from "../initializePassport";
import { getStats } from "../sql";
var router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/stats", auth, async function (req, res) {
  const stats = await getStats();
  res.render("statistics", { stats, user: req.user });
});

export default router;
