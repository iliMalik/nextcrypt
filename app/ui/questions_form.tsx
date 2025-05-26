"use client";

import { useState } from "react";

type Question = {
  question_id: string;
  text: string;
};

type Props = {
  questions: Question[];
};

export default function QuestionsForm({ questions }: Props) {
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleClick = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    console.log("User Responses:", responses);
    // TODO: Send to backend
  };

  return (
    <div className="space-y-6 p-6">
      {questions.map((question) => (
        <div
          key={question.question_id}
          className="flex flex-col sm:flex-row sm:items-center sm:space-x-4"
        >
          <p className="text-lg font-medium">{question.text}</p>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => handleClick(question.question_id, "yes")}
              className={`px-4 py-2 rounded font-semibold border transition
              ${
                responses[question.question_id] === "yes"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-500"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleClick(question.question_id, "no")}
              className={`px-4 py-2 rounded font-semibold border transition
              ${
                responses[question.question_id] === "no"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white text-green-500 border-green-500"
              }`}
            >
              No
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
