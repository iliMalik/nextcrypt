import { Responses } from "lib/definitions";

const API_BASE_URL = "https://bcbc-py.vercel.app";

export async function addResponses(data: Responses): Promise<void> {
  const url = `${API_BASE_URL}/responses/`;

  console.log("sending:", data);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Added Content-Type
      accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to save responses");
  }

  console.log("Responses saved successfully");
}
