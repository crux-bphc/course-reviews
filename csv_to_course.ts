import { Course, Without } from "./types";
import fs from "fs";
import readline from "readline";

const courses = new Map<number, Course>();
let com_code = 0;
let arr: [string] = [""];

async function processLineByLine() {
  const fileStream = fs.createReadStream("timetable.csv");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    const row = line.split(",");
    if (row[2].trim().length != 0) {
      com_code = parseInt(row[1].trim());
      console.log("New course: ", row[1], parseInt(row[1], 10));
      courses.set(com_code, {
        com_code: parseInt(row[1].trim()),
        course_code: row[2].trim(),
        course_name: row[4].trim(),
        instructors: "",
        hits: 0,
      });
    }
    const newInstructor = row[15].trim();
    if (newInstructor.length > 5) {
      const currCourse = courses.get(com_code) as Course;
      let instructors = currCourse.instructors;
      if (
        !instructors.toLocaleLowerCase().includes(newInstructor.toLowerCase())
      ) {
        if (instructors == "") {
          instructors = newInstructor;
        } else {
          instructors += ", " + row[15].trim();
        }
        courses.set(com_code, {
          ...currCourse,
          instructors,
        });
      }
    }
  }

  let csv = "com_code,course_code,course_name,instructors,hits\n";
  courses.forEach((course) => {
    csv += `${course.com_code},"${course.course_code}","${course.course_name}","${course.instructors}",${course.hits}\n`;
  });

  fs.writeFileSync("output.csv", csv);
}

processLineByLine();
