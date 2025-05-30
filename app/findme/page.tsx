import { getPersons } from "data/persons";
import { Person } from "lib/definitions";
import PersonsClient from "@/user_interface/persons_client_react";

export default async function PersonsPage() {
  const persons: Person[] = await getPersons();

  return <PersonsClient persons={persons} />;
}
