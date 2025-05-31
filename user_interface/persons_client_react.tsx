"use client";
//#region IMPORTS
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { PropsPersons, Session, Question } from "@/lib/definitions";
import { Person } from "lib/definitions";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";

import StartAssessment from "./start_assessment";
import { getQuestions } from "@/data/questions";
import { addSession } from "@/data/sessions";
import AddPersonForm from "./person_add";
import { PersonFormData } from "@/lib/definitions";
import { addPerson } from "@/data/persons";

//#endregion

export default function PersonsClient({ persons }: PropsPersons) {
  const [startAssessment, setStartAssessment] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [personList, setPersonList] = useState<Person[]>(persons);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const actionBody = (rowData: Person) => (
    <Button
      label="Start Assessment"
      text
      raised
      onClick={() => {
        handleStartAssessment(rowData);
      }}
    />
  );

  const handleStartAssessment = async (person: Person) => {
    const fetchedQuestions = await getQuestions();
    const sessionData = await addSession(person.person_id);

    setSelectedPerson(person);
    setQuestions(fetchedQuestions);
    setSession(sessionData);

    setStartAssessment(true);
  };

  const handleAddPerson = async (data: PersonFormData) => {
    const newPerson = await addPerson(
      data.person_age,
      data.person_first_name,
      data.person_last_name,
      data.person_gender
    );
    setPersonList((prev) => [...prev, newPerson]);
    setShowAddPersonForm(false);
  };

  return (
    <div>
      <div>
        <h1>Are you here?</h1>
        <Button
          onClick={() => setShowAddPersonForm(true)}
          label="No, add me please"
          text
          raised
        />

        <AddPersonForm
          visible={showAddPersonForm}
          onHide={() => setShowAddPersonForm(false)}
          onSubmit={handleAddPerson}
        />
      </div>

      <div style={{ width: "60%", float: "left", padding: "1rem" }}>
        <DataTable
          value={personList}
          globalFilter={globalFilter}
          globalFilterFields={[
            "person_first_name",
            "person_last_name",
            "person_gender",
          ]}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          sortMode="multiple"
          removableSort
          tableStyle={{ tableLayout: "auto" }}
          stripedRows
          className="small-table"
        >
          <Column
            field="person_first_name"
            header="First Name"
            sortable
            headerStyle={{ textAlign: "center" }}
          />
          <Column
            field="person_last_name"
            header="Last Name"
            sortable
            headerStyle={{ textAlign: "center" }}
          />
          <Column
            field="person_age"
            header="Age"
            sortable
            headerStyle={{ textAlign: "center" }}
          />
          <Column
            field="person_gender"
            header="Gender"
            sortable
            headerStyle={{ textAlign: "center" }}
          />
          <Column body={actionBody} />
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
    </div>
  );
}
