import { Person } from "lib/definitions";

const API_BASE_URL = "https://bcbc-py.vercel.app";

export async function getPersons(): Promise<Person[]> {
  try {
    const url = `${API_BASE_URL}/persons/`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store", // Optional: disables caching for latest data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch persons: ${res.statusText}`);
    }

    const data: Person[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching persons:", error);
    throw error;
  }
}

export async function addPerson(
  person_age: number,
  person_first_name: string,
  person_last_name: string,
  person_gender: "male" | "female" | "other"
): Promise<Person> {
  const url = `${API_BASE_URL}/persons/`;
  const body = {
    person_age,
    person_first_name,
    person_last_name,
    person_gender,
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
    throw new Error(`Failed to add person: ${response.statusText}`);
  }

  const data: Person = await response.json();

  return data;
}
