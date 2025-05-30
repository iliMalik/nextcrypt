"use client";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PropsPersons } from "@/lib/definitions";
import AddPersonForm from "user_interface/person_add_form";
import ScreeningDialog from "user_interface/assessment_new";
import { getPersons } from "data/persons";
import { Person } from "lib/definitions"; // Ensure definitions are imported for types
import { addSession } from "@/data/sessions";
import { Session } from "@/lib/definitions";
import { getSessions_PID } from "@/data/sessions";
import { personsColumns } from "@/lib/columns/persons";
// Mock child table data (replace with real data if available)
interface Activity {
  id: string;
  action: string;
  date: string;
}

export default function PersonsClient({ persons }: PropsPersons) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [personState, setPersons] = useState<Person[]>(persons);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [sessionsByPerson, setSessionsByPerson] = useState<
    Record<string, Session[]>
  >({});
  const [loadingSessions, setLoadingSessions] = useState<
    Record<string, boolean>
  >({});

  return (
    <DataTable value={persons} tableStyle={{ minWidth: "50rem" }}>
      {personsColumns.map((col, i) => (
        <Column key={col.field} field={col.field} header={col.header} />
      ))}
    </DataTable>
  );
}
