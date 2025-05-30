import { Session } from "lib/definitions";

const API_BASE_URL = "https://bcbc-py.vercel.app";

export async function addSession(person_id: string): Promise<Session> {
  const url = `${API_BASE_URL}/sessions/`;
  const body = {
    person_id,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Added Content-Type
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to add session: ${response.statusText}`);
  }

  const data: Session = await response.json();
  console.log(data);

  return data;
}

export async function getSessions_PID(person_id: string): Promise<Session[]> {
  const url = `${API_BASE_URL}/sessions?person_id=${encodeURIComponent(
    person_id
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Added Content-Type
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fethc sessions: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}
