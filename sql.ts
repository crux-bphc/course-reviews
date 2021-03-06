import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import fs from "fs";
import { Attachment, Course, Feedback, User, Without } from "./types";

const DB_LOCATION = "cfb.sqlite3";

var db_instance: null | Database<sqlite3.Database, sqlite3.Statement> = null;

export async function getDB() {
  if (db_instance !== null) {
    return db_instance;
  } else {
    db_instance = await open({
      filename: DB_LOCATION,
      driver: sqlite3.Database,
    });
    return db_instance;
  }
}

export async function createAllTables() {
  const db = await getDB();
  const statements = fs.readFileSync("tables.sql").toString();
  await db.exec(statements);
}

export async function getUser(email: string): Promise<User | undefined> {
  const db = await getDB();
  return await db.get("SELECT * FROM users WHERE email = ?", [email]);
}

export async function saveUser(user: User) {
  const db = await getDB();
  await db.run(
    "INSERT INTO users (email, google_id, name, photo, admin, num_reviews, banned) VALUES (?, ?, ?, ?, ?, ?, ?)",
    Object.values(user)
  );
}

export async function banUser(email: string) {
  const db = await getDB();
  await db.run("UPDATE USERS SET banned=1 WHERE email = ?", email);
}

export async function unBanUser(email: string) {
  const db = await getDB();
  await db.run("UPDATE USERS SET banned=0 WHERE email = ?", email);
}

export async function deleteCourse(course_code: string) {
  const db = await getDB();
  return await db.exec(
    `PRAGMA foreign_keys = 0; DELETE FROM courses WHERE course_code = "${course_code}"`
  );
}

export async function getCourses(): Promise<[Course]> {
  const db = await getDB();
  return await db.all("SELECT * from courses");
}

export async function createCourse(course: Without<Course, "id">) {
  console.log(course);
  const db = await getDB();
  return await db.run(
    `INSERT INTO "main"."courses"
  ("com_code", "course_code", "course_name", "instructors", "hits")
  VALUES (?, ?, ?, ?, ?)`,
    Object.values(course)
  );
}

export async function upvote(feedbackId: number) {
  const db = await getDB();
  await db.run("UPDATE feedbacks SET upvotes = upvotes + 1 WHERE ID = ?", [
    feedbackId,
  ]);
}

export async function incrementReviewCount(email: string) {
  const db = await getDB();
  await db.run(
    "UPDATE users SET num_reviews = num_reviews + 1 WHERE email = ?",
    email
  );
}

export async function decrementReviewCount(email: string) {
  const db = await getDB();
  await db.run(
    "UPDATE users SET num_reviews = num_reviews - 1 WHERE email = ?",
    email
  );
}

export async function downvote(feedbackId: number) {
  const db = await getDB();
  await db.run("UPDATE feedbacks SET downvotes = downvotes + 1 WHERE id = ?", [
    feedbackId,
  ]);
}

export async function saveFeedback(feedback: Without<Feedback, "id">) {
  const db = await getDB();
  return await db.run(
    `INSERT INTO "feedbacks" ("email", "name", "course_code", "recommend", "anonymous", "general_feedback", "general_feedback_score", "grading", "grading_score", "liteness", "liteness_score", "suggestions", "upvotes", "downvotes","review_title","photo","timestamp") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    Object.values(feedback)
  );
}

export async function increaseHitsCourse(course_code: string) {
  const db = await getDB();
  await db.run("UPDATE courses SET hits = hits + 1 WHERE course_code = ?", [
    course_code,
  ]);
}

export async function getFeedback(course_code: string): Promise<[Feedback]> {
  const db = await getDB();
  return await db.all(
    "SELECT * FROM feedbacks WHERE course_code = ? ORDER BY (upvotes-downvotes) DESC",
    course_code
  );
}

export async function getFeedbackById(
  id: number
): Promise<Feedback | undefined> {
  const db = await getDB();
  return await db.get("SELECT * FROM feedbacks WHERE id = ?", id);
}

export async function deleteFeedback(id: number) {
  const db = await getDB();
  await db.run("DELETE FROM feedbacks WHERE id = ?", id);
}

export async function saveAttachment(attachment: Without<Attachment, "id">) {
  const db = await getDB();
  return await db.run(
    'INSERT INTO "main"."attachments" ( "name", "weburl", "course_code", "timestamp") VALUES (?, ?, ?, ?);',
    Object.values(attachment)
  );
}

export async function getAttachment(
  course_code: string
): Promise<[Attachment]> {
  const db = await getDB();
  return await db.all("SELECT * FROM attachments WHERE course_code = ?", [
    course_code,
  ]);
}

export async function getLast10Feedbacks(): Promise<[Feedback]> {
  const db = await getDB();
  return await db.all(
    "SELECT * FROM feedbacks  ORDER BY timestamp DESC LIMIT 10"
  );
}

export async function getCourse(
  course_code: string
): Promise<Course | undefined> {
  const db = await getDB();
  return await db.get("SELECT * FROM courses WHERE course_code = ?", [
    course_code,
  ]);
}

export async function getStats() {
  const db = await getDB();
  const promises = [
    db.get("SELECT COUNT(*) FROM courses"),
    db.get("SELECT COUNT(*) FROM feedbacks"),
    db.get("SELECT COUNT(*) FROM users"),
    db.get("SELECT COUNT(*) FROM attachments"),
    db.get("SELECT SUM(hits) FROM courses"),
  ];

  const result = await Promise.all(promises);
  return {
    numCourses: result[0]["COUNT(*)"],
    numReviews: result[1]["COUNT(*)"],
    numAccounts: result[2]["COUNT(*)"],
    numAttachments: result[3]["COUNT(*)"],
    totalHits: result[4]["SUM(hits)"],
  };
}

// Run raw sql query. Unsafe AF.
export async function runStatement(statement: string, withResult: boolean) {
  const db = await getDB();
  try {
    if (withResult) {
      const result = await db.all(statement);
      return result;
    } else {
      const result = await db.exec(statement);
      return result;
    }
  } catch (err) {
    return JSON.stringify(err);
  }
}
