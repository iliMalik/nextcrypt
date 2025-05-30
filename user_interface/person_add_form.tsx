// app/persons/AddPersonForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Add Select components
// If this import fails, update the path below to the correct location of your Select component, for example:
// } from "../components/ui/select";
// or
// } from "@/components/your-correct-path/select";
import { addPerson } from "data/persons";

// Form schema
const formSchema = z.object({
  person_first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name too long"),
  person_last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name too long"),
  person_age: z.number().int().min(0, "years only").max(99, "Come on, really"),
  person_gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
    invalid_type_error: "Please enter male, female or other",
  }),
});

interface AddPersonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPersonAdded: () => void; // Callback to refresh table
}

export default function AddPersonForm({
  open,
  onOpenChange,
  onPersonAdded,
}: AddPersonFormProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      person_first_name: "",
      person_last_name: "",
      person_age: 0,
      person_gender: undefined, // Use undefined for optional fields
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addPerson(
        values.person_age,
        values.person_first_name,
        values.person_last_name,
        values.person_gender
      );
      form.reset();
      setError(null);
      onPersonAdded(); // Trigger table refresh
      onOpenChange(false); // Close dialog
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add person");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add me</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="person_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="person_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="person_age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number" // Ensure numeric input
                    placeholder="How old are you, really? ;)"
                    value={field.value ?? ""} // Controlled value
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    } // Convert to number
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="person_gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
