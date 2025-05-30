import { Question } from "lib/definitions";

const url = "https://bcbc-py.vercel.app/questions/";

export async function getQuestions(): Promise<Question[]> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store", // Optional: disables caching for latest data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch questions: ${res.statusText}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}
