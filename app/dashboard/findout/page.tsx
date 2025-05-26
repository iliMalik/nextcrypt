// app/questions/page.tsx

import QuestionsForm from "@/app/ui/questions_form";

type Question = {
  question_id: string;
  text: string;
};

async function getQuestions(): Promise<Question[]> {
  const res = await fetch("https://bcbc-py.onrender.com/questions/", {
    cache: "no-store",
  });
  const data = await res.json();
  return data.questions || [];
}

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return (
    <div>
      <h1 className="font-bold font-color-blue">In the past two weeks:</h1>
      {/* Pass questions as prop to client component */}
      <QuestionsForm questions={questions} />
    </div>
  );
}
