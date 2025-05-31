"use client";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface SampleData {
  id: string;
  name: string;
  age: number;
}

export default function PracticeArea() {
  // Sample data
  const [data] = useState<SampleData[]>([
    { id: "1", name: "Alice", age: 25 },
    { id: "2", name: "Bob", age: 30 },
    { id: "3", name: "Charlie", age: 35 },
  ]);

  // Button column body
  const actionBody = (rowData: SampleData) => (
    <Button
      label="View"
      icon="pi pi-eye"
      className="p-button-info"
      onClick={() => alert(`Viewing ${rowData.name} (ID: ${rowData.id})`)}
    />
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Practice Area</h1>
      <p className="mb-4">Testing PrimeReact DataTable with a button column</p>
      <DataTable
        value={data}
        paginator
        rows={5}
        tableStyle={{ minWidth: "30rem" }}
      >
        <Column field="id" header="ID" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="age" header="Age" sortable />
        <Column header="Action" body={actionBody} />
      </DataTable>
    </div>
  );
}
