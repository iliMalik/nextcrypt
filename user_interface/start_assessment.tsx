"use client";
import React, { useState } from "react";
import { Session, Person, Question } from "@/lib/definitions";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { addResponses } from "@/data/responses"; // Ensure this function is defined to handle responses

type Props = {
  visible: boolean;
  onHide: () => void;
  questions: Question[];
  person: Person;
  session: Session;
};

export default function StartAssessment({
  visible,
  onHide,
  person,
  session,
  questions,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const handleAnswer = (answer: "YES" | "NO") => {
    const currentQuestion = questions[currentIndex];
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.question_id]: answer,
    }));

    setCurrentIndex(currentIndex + 1);
  };

  const handleSubmit = () => {
    // Here you would typically send the responses to your backend
    const preparedResponses = {
      session_id: session.session_id,
      answers: responses,
    };
    console.log("Submitting responses:", preparedResponses);
    // Simulate a submission to the backend
    addResponses(preparedResponses);
    onHide(); // Close the dialog after submission
    setCurrentIndex(0); // Reset index for next assessment
    setResponses({}); // Reset responses for next assessment
  };
  const currentQuestion = questions[currentIndex];

  const handleClose = () => {
    onHide();
    setCurrentIndex(0); // Reset index for next assessment
    setResponses({}); // Reset responses for next assessment
  };
  return (
    <Dialog
      header={`Assessment for ${person.person_first_name}`}
      visible={visible}
      onHide={handleClose}
      style={{ width: "50vw" }}
      modal
    >
      <p>Session Date: {session.session_date}</p>

      {currentQuestion ? (
        <div>
          <p>
            {" "}
            Question {currentIndex + 1} of {questions.length}
          </p>
          <ProgressBar
            value={Math.round((currentIndex + 1) / questions.length) * 100}
            showValue={true}
            style={{ height: "10px", marginBottom: "1rem" }}
          />
          <div>
            <p>{currentQuestion.question_text}</p>
            <Button onClick={() => handleAnswer("YES")}>Yes</Button>
            <Button onClick={() => handleAnswer("NO")}>No</Button>
          </div>
        </div>
      ) : (
        <div>
          <p>All questions answered.</p>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </Dialog>
  );
}
