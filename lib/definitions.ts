// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

import { z } from "zod";

export const addPerson_formSchema = z.object({
  person_first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name too long"),
  person_last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name too long"),
  person_age: z.number().int().min(0, "years only").max(99, "Come on, really"),
  person_gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
    invalid_type_error: "Please enter male, female or other",
  }),
});
export type PersonFormData = z.infer<typeof addPerson_formSchema>;

export interface Person {
  person_age: number;
  person_first_name: string;
  person_last_name: string;
  person_gender: "male" | "female" | "other";
  person_id: string;
}

export interface PropsPersons {
  persons: Person[];
}
export interface Question {
  question_id: string;
  question_text: string;
}

export interface PropsQuestions {
  questions: Question[];
}

export interface Responses {
  session_id: string;
  answers: { [key: string]: string };
}

export interface Session {
  session_id: string;
  person_id: string;
  session_date: string;
}
