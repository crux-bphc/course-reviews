import express from "express";
import { auth } from "../initializePassport";
import {
  downvote,
  getAttachment,
  getCourse,
  getFeedback,
  getLast10Feedbacks,
  increaseHitsCourse,
  saveAttachment,
  saveFeedback,
  upvote,
} from "../sql";
import { Attachment, Course, Feedback, User, Without } from "../types";
var router = express.Router();

function spaceToScore(str: string) {
  return str.replaceAll(" ", "_");
}

/* GET users listing. */
router.get("/", auth, async function (req, res, next) {
  res.render("course", { user: req.user });
});

router.get("/reviews/list", auth, async function (req, res) {
  const reviews = await getLast10Feedbacks();
  return res.render("list", { user: req.user, reviews });
});

router.get(
  "/review/:course_code/:course_name",
  auth,
  async function (req, res, next) {
    const courseCode = req.params.course_code.replace("_", " ");
    const courseDetails = await getCourse(courseCode);
    return res.render("write", {
      course: courseDetails,
      user: req.user,
    });
  }
);

router.post("/addAttachment", auth, async function (req, res) {
  const attachment: Without<Attachment, "id"> = {
    name: req.body.name,
    weburl: req.body.weburl,
    course_code: req.body.course_code,
    timestamp: Date.now(),
  };

  await saveAttachment(attachment);
  res.redirect(
    `/courses/${spaceToScore(req.body.course_code)}/${spaceToScore(
      req.body.course_name
    )}`
  );
});

router.post("/postReview", auth, async function (req, res) {
  const feedback: Without<Feedback, "id"> = {
    // @ts-ignore
    email: req.user.email,
    // @ts-ignore
    name: req.user.name,
    course_code: req.body.course_code,
    recommend: req.body.recommend ? 1 : 0,
    anonymous: req.body.anonymous ? 1 : 0,
    general_feedback: req.body.general_feedback,
    general_feedback_score: req.body.general_feedback_score,
    grading: req.body.grading,
    grading_score: req.body.grading_score,
    liteness: req.body.liteness,
    liteness_score: req.body.liteness_score,
    suggestions: req.body.suggestions,
    upvotes: 0,
    downvotes: 0,
    review_title: req.body.review_title,
    // @ts-ignore
    photo: req.user.photo,
    timestamp: Date.now(),
  };

  const courseDetails = (await getCourse(feedback.course_code)) as Course;
  await saveFeedback(feedback);

  res.redirect(
    `/courses/${spaceToScore(feedback.course_code)}/${spaceToScore(
      courseDetails.course_name
    )}`
  );
});

router.get("/new", auth, async function (req, res) {
  return res.render("request-course", { user: req.user });
});

router.get("/upvote", auth, async function (req, res, next) {
  const feedbackId = parseInt(req.query.feedbackId as string);
  if (feedbackId === undefined) {
    return;
  }

  res.end(await upvote(feedbackId));
});

router.get("/downvote", auth, async function (req, res, next) {
  const feedbackId = parseInt(req.query.feedbackId as string);
  if (feedbackId === undefined) {
    return;
  }

  res.end(await downvote(feedbackId));
});

router.get(
  ["/:course_code/:course_name", "/:course_code/"],
  auth,
  async function (req, res, next) {
    const courseCode = req.params.course_code.replace("_", " ");
    const courseDetails = await getCourse(courseCode);
    const reviews = await getFeedback(courseCode);
    const attachments = await getAttachment(courseCode);

    increaseHitsCourse(courseCode);

    res.render("courseDetails", {
      user: req.user,
      course: courseDetails,
      reviews,
      attachments,
    });
  }
);

export default router;
