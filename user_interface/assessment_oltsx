// app/persons/ScreeningDialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/lib/definitions";
import { getQuestions } from "data/questions";
import { Person } from "lib/definitions";
import { Session } from "lib/definitions";
import { addResponses } from "@/data/responses";
import { Responses } from "@/lib/definitions";

interface ScreeningDialogProps
  extends Pick<Person, "person_id" | "person_first_name">,
    Pick<Session, "session_id" | "session_date"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (person_id: string, responses: { [key: string]: string }) => void;
}

export default function ScreeningDialog({
  open,
  onOpenChange,
  person_id,
  person_first_name,
  session_id,
  session_date,
  onSubmit,
}: ScreeningDialogProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch questions when dialog opens
  useEffect(() => {
    if (open) {
      const fetchQuestions = async () => {
        try {
          setIsLoading(true);
          const fetchedQuestions = await getQuestions();
          setQuestions(fetchedQuestions);
          setCurrentQuestionIndex(0);
          setResponses({});
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch questions"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [open]);

  // Handle Yes/No response
  const handleResponse = (question_id: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [question_id]: answer,
    }));
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const sessionResponses: Responses = {
        session_id,
        answers: responses,
      };

      console.log(
        "Screening responses:",
        JSON.stringify(sessionResponses, null, 2)
      );

      await addResponses(sessionResponses);
      await onSubmit(person_id, responses);

      setError(null);
      setResponses({});
      setCurrentQuestionIndex(0);
      onOpenChange(false); // Close dialog
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit responses"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Cancel button
  const handleCancel = () => {
    setResponses({});
    setCurrentQuestionIndex(0);
    onOpenChange(false); // Close dialog
  };
  const sessiondateStr = new Date(session_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const isQuizComplete = currentQuestionIndex >= questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>
              Loading screening questions...
            </DialogDescription>
          </DialogHeader>
          <p>Loading questions...</p>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="mt-4"
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setDialogOpen}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Hello {person_first_name} 🙂 </DialogTitle>
          <DialogDescription>
            your new session for {sessiondateStr}
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {isQuizComplete ? (
          <div className="space-y-4">
            <p className="text-lg">All questions answered!</p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <Progress value={progress} className="mb-4" />
            <p className="text-lg">{currentQuestion?.question_text}</p>
            <div className="flex gap-4">
              <Button
                variant={
                  responses[currentQuestion?.question_id] === "Yes"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleResponse(currentQuestion.question_id, "Yes")
                }
                className="w-24"
                disabled={isSubmitting}
              >
                Yes
              </Button>
              <Button
                variant={
                  responses[currentQuestion?.question_id] === "No"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handleResponse(currentQuestion.question_id, "No")
                }
                className="w-24"
                disabled={isSubmitting}
              >
                No
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
