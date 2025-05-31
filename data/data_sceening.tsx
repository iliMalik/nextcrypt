import { ScreeningResult } from "lib/definitions";

const API_BASE_URL = "https://bcbc-py.vercel.app";

export async function get_screening(
  session_id: string
): Promise<ScreeningResult> {
  try {
    const url = `${API_BASE_URL}/screening/${session_id}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: "", // important: explicitly send empty body
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch screening: ${response.status} ${response.statusText}`
      );
    }

    const data: ScreeningResult = await response.json();
    console.log("Screening data:", data);
    return data;
  } catch (error) {
    console.error("Error in get_screening:", error);
    throw error;
  }
}
