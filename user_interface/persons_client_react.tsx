"use client";

//#region IMPORTS
import { useState } from "react";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowToggleEvent,
  DataTableRowEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import StartAssessment from "./start_assessment";
import AddPersonForm from "./person_add";
import ScreeningDialog from "./screening";

import {
  PropsPersons,
  Session,
  Question,
  PersonFormData,
} from "@/lib/definitions";
import { Person } from "@/lib/definitions";

import { getQuestions } from "@/data/questions";
import { addSession, getSessions_PID } from "@/data/sessions";
import { addPerson } from "@/data/persons";
//#endregion

export default function PersonsClient({ persons }: PropsPersons) {
  const [startAssessment, setStartAssessment] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [personList, setPersonList] = useState<Person[]>(persons);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | undefined
  >(undefined);
  const [sessionsByPerson, setSessionsByPerson] = useState<
    Record<string, Session[]>
  >({});

  const handleStartAssessment = async (person: Person) => {
    try {
      const fetchedQuestions = await getQuestions();
      const sessionData = await addSession(person.person_id);
      setSelectedPerson(person);
      setQuestions(fetchedQuestions);
      setSession(sessionData);
      setStartAssessment(true);
    } catch (error) {
      console.error("Failed to start assessment:", error);
      alert("Error starting assessment. Please try again.");
    }
  };

  const handleAddPerson = async (data: PersonFormData) => {
    try {
      const newPerson = await addPerson(
        data.person_age,
        data.person_first_name,
        data.person_last_name,
        data.person_gender
      );
      setPersonList((prev) => [...prev, newPerson]);
      setShowAddPersonForm(false);
    } catch (error) {
      console.error("Failed to add person:", error);
      alert("Error adding person. Please try again.");
    }
  };

  const handleRowExpand = async (event: DataTableRowEvent) => {
    const person = event.data as Person;
    if (!sessionsByPerson[person.person_id]) {
      const sessions = await getSessions_PID(person.person_id);
      setSessionsByPerson((prev) => ({
        ...prev,
        [person.person_id]: sessions,
      }));
    }
  };

  /* Add this function before rowExpansionTemplate */
  const handleSessionClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setDialogVisible(true);
  };
  const rowExpansionTemplate = (person: Person) => {
    const sessions = sessionsByPerson[person.person_id] || [];
    return (
      <div className="ml-4">
        <h4>
          Sessions for {person.person_first_name} {person.person_last_name}
        </h4>
        <DataTable value={sessions}>
          <Column
            field="session_id"
            header="Session ID"
            body={(rowData: Session) => (
              <button
                className="text-blue-600 hover:underline focus:outline-none"
                onClick={() => handleSessionClick(rowData.session_id)}
              >
                {rowData.session_id}
              </button>
            )}
          />
          <Column
            field="session_date"
            header="Start Time"
            body={(rowData: Session) =>
              new Date(rowData.session_date).toLocaleString("en-US", {
                timeZone: "America/New_York",
                dateStyle: "short",
                timeStyle: "short",
              })
            }
          />
        </DataTable>
      </div>
    );
  };
  const actionBodyTemplate = (rowData: Person) => (
    <Button
      label="Start Assessment"
      text
      raised
      onClick={() => handleStartAssessment(rowData)}
    />
  );
  /* Add this before the return statement */

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Are you here ?</h1>
        <Button
          onClick={() => setShowAddPersonForm(true)}
          label="No, add me please"
          className="p-button-primary"
        />
        <AddPersonForm
          visible={showAddPersonForm}
          onHide={() => setShowAddPersonForm(false)}
          onSubmit={handleAddPerson}
        />
      </div>

      <div className="w-6 p-3">
        <div className="p-field">
          <InputText
            id="search"
            type="search"
            onInput={(e) => setGlobalFilter(e.currentTarget.value || "")}
            placeholder="Search..."
            className="w-full mb-3"
          />
        </div>
        <DataTable
          value={personList}
          expandedRows={expandedRows}
          onRowToggle={(e: DataTableRowToggleEvent) =>
            setExpandedRows(e.data as DataTableExpandedRows)
          }
          onRowExpand={handleRowExpand}
          rowExpansionTemplate={rowExpansionTemplate}
          globalFilter={globalFilter}
          globalFilterFields={
            [
              "person_first_name",
              "person_last_name",
              "person_gender",
            ] as (keyof Person)[]
          }
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          sortMode="multiple"
          removableSort
          tableStyle={{ tableLayout: "auto" }}
          stripedRows
          className="small-table"
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="person_first_name" header="First Name" sortable />
          <Column field="person_last_name" header="Last Name" sortable />
          <Column field="person_age" header="Age" sortable />
          <Column field="person_gender" header="Gender" sortable />
          <Column body={actionBodyTemplate} header="Action" />
        </DataTable>
      </div>

      {selectedPerson && session && (
        <StartAssessment
          visible={startAssessment}
          onHide={() => setStartAssessment(false)}
          questions={questions}
          person={selectedPerson}
          session={session}
        />
      )}
      {selectedSessionId && (
        <ScreeningDialog
          visible={dialogVisible}
          sessionId={selectedSessionId}
          onHide={() => {
            setDialogVisible(false);
            setSelectedSessionId(null);
          }}
        />
      )}
    </div>
  );
}
