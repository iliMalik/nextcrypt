import { Button } from "primereact/button";

export interface PersonColumn {
  field?: string;
  header: string;
  headerStyle?: React.CSSProperties;
  body?: (rowData: any) => React.ReactNode;
}

export const personsColumns: PersonColumn[] = [
  {
    field: "person_first_name",
    header: "First Name",
    headerStyle: { textAlign: "center" },
  },
  {
    field: "person_last_name",
    header: "Last Name",
    headerStyle: { textAlign: "center" },
  },
  {
    field: "person_age",
    header: "Age",
    headerStyle: { textAlign: "center" },
  },
  {
    field: "person_gender",
    header: "Gender",
    headerStyle: { textAlign: "center" },
  },
];
