"use client";
import React, { useState } from "react";
import { Session, Person, Question } from "@/lib/definitions";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { addResponses } from "@/data/responses";

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
    const preparedResponses = {
      session_id: session.session_id,
      answers: responses,
    };
    console.log("Submitting responses:", preparedResponses);
    addResponses(preparedResponses);
    handleClose();
  };

  const handleClose = () => {
    onHide();
    setCurrentIndex(0);
    setResponses({});
  };

  const currentQuestion = questions[currentIndex];

  // Correct progress calculation: currentIndex out of total questions
  const progressValue =
    questions.length === 0 ? 0 : (currentIndex / questions.length) * 100;

  // Helper to format date string in EST (New York) timezone
  const formatDateToEST = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/New_York",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <Dialog
      header={`Assessment for ${person.person_first_name}`}
      visible={visible}
      onHide={handleClose}
      style={{ width: "55vw", maxWidth: "600px", minHeight: "350px" }}
      modal
      className="custom-dialog"
      blockScroll
    >
      <div
        style={{
          padding: "1.5rem",
          backgroundColor: "#f9f9fb",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          minHeight: "280px",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              fontWeight: "600",
              marginBottom: "0.25rem",
              color: "#444",
            }}
          >
            Session Date: {formatDateToEST(session.session_date)}
          </p>

          {currentQuestion ? (
            <>
              <p
                style={{
                  marginBottom: "0.25rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Question {currentIndex + 1} of {questions.length}
              </p>
              <ProgressBar
                value={progressValue}
                showValue={false}
                style={{
                  height: "12px",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                }}
                color="#4caf50"
              />
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  marginBottom: "1rem",
                  color: "#222",
                }}
              >
                {currentQuestion.question_text}
              </p>
            </>
          ) : (
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#444",
                marginBottom: "2rem",
              }}
            >
              All questions answered.
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: currentQuestion ? "space-around" : "center",
            gap: "1.5rem",
          }}
        >
          {currentQuestion ? (
            <>
              <Button
                label="Yes"
                severity="success"
                rounded
                style={{ minWidth: "120px", fontWeight: "600" }}
                onClick={() => handleAnswer("YES")}
              />
              <Button
                label="No"
                severity="danger"
                rounded
                style={{ minWidth: "120px", fontWeight: "600" }}
                onClick={() => handleAnswer("NO")}
              />
            </>
          ) : (
            <Button
              label="Submit"
              severity="danger"
              rounded
              style={{ minWidth: "160px", fontWeight: "700" }}
              onClick={handleSubmit}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}
