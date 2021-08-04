import { writeFileSync } from "fs";
import { getCourses } from "./sql";

async function run() {
  console.log("Fetching from DB");
  const courses = await getCourses();
  console.log("Making string");
  const dataStr = "const courses = " + JSON.stringify(courses) + ";";
  console.log("Writing file");
  writeFileSync("public/javascripts/generated-courses-list.js", dataStr);
  console.log("Done");
}

run();
