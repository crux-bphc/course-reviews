CREATE TABLE "attachments" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	TEXT NOT NULL,
	"weburl"	TEXT NOT NULL,
	"course_code"	TEXT NOT NULL,
	"timestamp"	INTEGER NOT NULL,
	FOREIGN KEY("course_code") REFERENCES "courses"("course_code")
);

CREATE TABLE "courses" (
	"com_code"	INTEGER NOT NULL,
	"course_code"	TEXT NOT NULL,
	"course_name"	TEXT NOT NULL,
	"instructors"	TEXT,
	PRIMARY KEY("course_code")
);

CREATE TABLE "feedbacks" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"email"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"course_code"	TEXT NOT NULL,
	"recommend"	INTEGER NOT NULL DEFAULT 1,
	"anonymous"	INTEGER NOT NULL DEFAULT 1,
	"general_feedback"	TEXT NOT NULL,
	"general_feedback_score"	INTEGER NOT NULL DEFAULT 5,
	"grading"	TEXT,
	"grading_score"	INTEGER NOT NULL DEFAULT 5,
	"liteness"	TEXT,
	"liteness_score"	INTEGER NOT NULL DEFAULT 5,
	"suggestions"	TEXT NOT NULL,
	"upvotes"	INTEGER NOT NULL DEFAULT 0,
	"downvotes"	INTEGER NOT NULL DEFAULT 0,
	"review_title"	TEXT,
	"photo"	TEXT,
	"timestamp"	INTEGER DEFAULT 0
);

CREATE TABLE "users" (
	"email"	TEXT NOT NULL,
	"google_id"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"photo"	TEXT NOT NULL,
	"admin"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("email")
);