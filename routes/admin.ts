import express from "express";
import { name } from "faker";
import { generateFrontendCourseListFile } from "../datagen";
import { auth } from "../initializePassport";
import {
  createCourse,
  deleteCourse,
  deleteFeedback,
  getStats,
  runStatement,
} from "../sql";
var router = express.Router();

router.get("/", (req, res) => {
  return res.render("admin", { user: req.user });
});

router.post("/deleteReview", (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.end("Invalid course id.");
  }

  deleteFeedback(id);
  return res.end("Review deleted.");
});

router.post("/createCourse", async (req, res) => {
  const course = {
    com_code: req.body.com_code,
    course_code: req.body.course_code,
    course_name: req.body.course_name,
    instructors: req.body.instructors,
    hits: 0,
  };
  await createCourse(course);
  generateFrontendCourseListFile();
  res.end("Course created.");
});

router.post("/deleteCourse", async (req, res) => {
  if (!req.body.course_code) {
    return res.end("Invalid course_code.");
  }

  console.log(req.body.course_code);

  await deleteCourse(req.body.course_code);
  generateFrontendCourseListFile();
  res.end("Course deleted.");
});

router.post("/runSQL", async (req, res) => {
  const result = await runStatement(req.body.statement, req.body.withResult);
  res.end(JSON.stringify(result, undefined, 2));
});

export default router;
