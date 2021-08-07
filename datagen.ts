import { writeFileSync } from "fs";
import path from "path";
import { getCourses } from "./sql";

// Convert SQL table to JSON for static search feature. Run after every course-list change.

export async function generateFrontendCourseListFile() {
  console.log("Fetching from DB");
  const courses = await getCourses();
  console.log("Making string");
  const dataStr =
    "const courses = JSON.parse(`" + JSON.stringify(courses) + "` );";
  console.log("Writing file");
  writeFileSync(
    path.join(__dirname, "../public/javascripts/generated-courses-list.js"),
    dataStr
  );
  console.log("Done");
}

if (require.main === module) {
  generateFrontendCourseListFile();
}
