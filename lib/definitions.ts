// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
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

export interface Columns {
  field: string;
  header: string;
  formDisabled?: boolean;

  style?: React.CSSProperties;
  dataType?: string; // e.g., "boolean", "string", etc.

  filter?: boolean;
  filterPlaceholder?: string;
  showFilterMenu?: boolean;
}
