"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PropsPersons } from "@/lib/definitions";
import AddPersonForm from "user_interface/person_add_form";
import ScreeningDialog from "user_interface/assessment_new";
import { getPersons } from "data/persons";
import { Person } from "lib/definitions"; // Ensure definitions are imported for types
import { addSession } from "@/data/sessions";
import { Session } from "@/lib/definitions";
import { getSessions_PID } from "@/data/sessions";
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

  const columns: ColumnDef<Person>[] = [
    {
      id: "expand",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setExpandedRows((prev) =>
              prev.includes(row.original.person_id)
                ? prev.filter((id) => id !== row.original.person_id)
                : [...prev, row.original.person_id]
            )
          }
        >
          {expandedRows.includes(row.original.person_id) ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: "person_first_name",
      header: "First Name",
      cell: ({ row }) => row.original.person_first_name || "N/A",
    },
    {
      accessorKey: "person_last_name",
      header: "Last Name",
      cell: ({ row }) => row.original.person_last_name || "N/A",
    },
    {
      accessorKey: "person_age",
      header: "Age",
      cell: ({ row }) => row.original.person_age ?? "N/A",
    },
    {
      accessorKey: "person_gender",
      header: "Gender",
      cell: ({ row }) => row.original.person_gender ?? "N/A",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const person = row.original;
              setSelectedPerson(person);

              const newSession = await addSession(person.person_id);
              setSession(newSession);
              setDialogOpen(true);
            }}
          >
            Start Screening
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: personState,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePersonAdded = async () => {
    try {
      // Fetch updated persons data after adding a new person
      const updatedPersons: Person[] = await getPersons();
      setPersons(updatedPersons);
    } catch (error) {
      console.error("Error fetching updated persons:", error);
    }
  };
  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Are you here?</h1>
        <button onClick={() => setIsFormOpen(true)}>No, add me, please</button>
        <AddPersonForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onPersonAdded={handlePersonAdded}
        />
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <ContextMenu key={row.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </ContextMenuTrigger>

                    {expandedRows.includes(row.original.person_id) && (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <div className="p-4 bg-gray-50">
                            <h3 className="text-sm font-semibold mb-2">
                              Sessions {row.original.person_first_name}
                            </h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Session</TableHead>
                                  <TableHead>Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getChildData(row.original.person_id).map(
                                  (activity) => (
                                    <TableRow key={activity.id}>
                                      <TableCell>{activity.action}</TableCell>
                                      <TableCell>{activity.date}</TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </ContextMenu>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedPerson && (
        <ScreeningDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          person_id={selectedPerson?.person_id ?? ""}
          person_first_name={selectedPerson?.person_first_name ?? ""}
          session_id={session?.session_id ?? ""}
          session_date={session?.session_date ?? ""}
          onSubmit={(responses) => {
            console.log("Responses submitted:", responses);
          }}
        />
      )}
    </>
  );
}
