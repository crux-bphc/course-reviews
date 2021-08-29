export type User = {
  email: string;
  google_id: string;
  name: string;
  photo: string;
  admin: number;
  num_reviews: number;
  banned: number;
};

export type Feedback = {
  id: number;
  email: string;
  name: string;
  course_code: string;
  recommend: number;
  anonymous: number;
  general_feedback: string;
  general_feedback_score: number;
  grading: string;
  grading_score: number;
  liteness: string;
  liteness_score: number;
  suggestions: string;
  upvotes: number;
  downvotes: number;
  review_title: string;
  photo: string;
  timestamp: number;
};

export type Attachment = {
  id: number;
  name: string;
  weburl: string;
  course_code: string;
  timestamp: number;
};

export type Course = {
  com_code: number;
  course_code: string;
  course_name: string;
  instructors: string;
  hits: number;
};

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
