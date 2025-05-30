import { getQuestions } from "@/data/questions";
import { Question } from "@/lib/definitions";
import QuestionsClient from "user_interface/questions_client";

export default async function practice() {
  const questions: Question[] = await getQuestions();

  return (
    <div>
      {" "}
      <h1>practice </h1>
      <QuestionsClient questions={questions} />
    </div>
  );
}
