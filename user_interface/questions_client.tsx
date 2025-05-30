"use client";
import { useState } from "react";

import { Question, PropsQuestions } from "lib/definitions";

export default function QuestionsClient({ questions }: PropsQuestions) {
  // State to track the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // State to store responses
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  // Handle Yes/No button clicks
  const handleResponse = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    // Move to the next question
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // Handle Submit button click
  const handleSubmit = () => {
    console.log("User Responses:", responses);
  };

  // Check if all questions are answered
  const isQuizComplete = currentQuestionIndex >= questions.length;

  // Get the current question (if any)
  const currentQuestion = questions[currentQuestionIndex];
  // Calculate progress (percentage)
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  return (
    <div className="p-4 max-w-2xl mx-auto bg-blue-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Practice Questions</h1>
      {isQuizComplete ? (
        <div className="p-6 border rounded-md bg-white shadow-sm">
          <p className="text-lg mb-4">All questions answered!</p>
          <Button onClick={handleSubmit} variant="default">
            Submit
          </Button>
        </div>
      ) : (
        <div className="p-6 border rounded-md bg-white shadow-sm">
          <p className="text-sm mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <Progress value={progress} className="mb-4" />
          <p className="text-lg mb-4">{currentQuestion?.question_text}</p>
          <div className="flex gap-4">
            <Button
              variant={
                responses[currentQuestion?.question_id] === "Yes"
                  ? "default"
                  : "outline"
              }
              onClick={() => handleResponse(currentQuestion.question_id, "Yes")}
              className="w-24 border-red-500"
            >
              Yes
            </Button>
            <Button
              variant={
                responses[currentQuestion?.question_id] === "No"
                  ? "default"
                  : "outline"
              }
              onClick={() => handleResponse(currentQuestion.question_id, "No")}
              className="w-24 border-blue-500"
            >
              No
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
