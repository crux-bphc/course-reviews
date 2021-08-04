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
    "INSERT INTO users (email, google_id, name, photo, admin) VALUES (?, ?, ?, ?, ?)",
    Object.values(user)
  );
}

export async function getCourses(): Promise<[Course]> {
  const db = await getDB();
  return await db.all("SELECT * from courses");
}

export async function upvote(feedbackId: number) {
  const db = await getDB();
  await db.run("UPDATE feedbacks SET upvotes = upvotes + 1 WHERE ID = ?", [
    feedbackId,
  ]);
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

export async function getFeedback(course_code: string): Promise<[Feedback]> {
  const db = await getDB();
  return await db.all(
    "SELECT * FROM feedbacks WHERE course_code = ? ORDER BY (upvotes-downvotes) DESC",
    course_code
  );
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

export async function getCourse(
  course_code: string
): Promise<Course | undefined> {
  const db = await getDB();
  return await db.get("SELECT * FROM courses WHERE course_code = ?", [
    course_code,
  ]);
}

// module.exports = {
//   createAllTables,
//   getUser,
//   getDB,
//   saveUser,
//   saveFeedback,
//   getFeedback,
//   saveAttachment,
//   getAttachment,
//   getCourse,
// };

export async function test() {
  const user = {
    email: "test@localhost",
    google_id: "1",
    name: "Admin\n",
    photo: "",
    admin: 1,
  };

  const feedback = {
    email: "lolcat@jsonable",
    name: "",
    course_code: "BIO F111",
    recommend: 1,
    anonymous: 1,
    general_feedback: "",
    general_feedback_score: 5,
    grading: "",
    grading_score: 5,
    liteness: "",
    liteness_score: 5,
    suggestions: "",
    upvotes: 0,
    downvotes: 0,
  };

  // await saveFeedback(feedback);
  // console.log(await getFeedback("BIO F111"));
}

function makeid(length: number) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

import faker from "faker";
async function garbage_courses() {
  const db = await getDB();
  const stmt = await db.prepare(
    "INSERT INTO courses (com_code, course_code, course_name, instructors) values (?, ?, ?, ?);"
  );

  for (let i = 0; i < 500; i++) {
    stmt.bind(
      1200 + i,
      makeid(3) + faker.datatype.number(5000),
      faker.hacker.noun() + " " + faker.hacker.noun(),
      faker.name.firstName() + " " + faker.name.lastName()
    );

    stmt.run();
  }
}
garbage_courses();
test();
