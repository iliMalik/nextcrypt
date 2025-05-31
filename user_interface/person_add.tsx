"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPerson_formSchema, PersonFormData } from "@/lib/definitions";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { addPerson } from "@/data/persons"; // Ensure this function is defined to add a

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export interface AddPersonFormProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: PersonFormData) => void;
  onCancel?: () => void;
}
export default function AddPersonForm({
  visible,
  onHide,
  onSubmit,
}: AddPersonFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonFormData>({
    resolver: zodResolver(addPerson_formSchema),
    defaultValues: {
      person_first_name: "",
      person_last_name: "",
      person_age: 0,
      person_gender: "male",
    },
  });

  const handleFormSubmit = (data: PersonFormData) => {
    onSubmit(data);
    reset(); // Clear the form
    onHide(); // Close dialog
  };

  return (
    <Dialog
      header="Add New Person"
      visible={visible}
      onHide={onHide}
      style={{ width: "35vw" }}
      modal
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-2">
        {/* First Name */}
        <div>
          <label>First Name</label>
          <Controller
            name="person_first_name"
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                className={`w-full ${
                  errors.person_first_name ? "p-invalid" : ""
                }`}
              />
            )}
          />
          {errors.person_first_name && (
            <small className="p-error">
              {errors.person_first_name.message}
            </small>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label>Last Name</label>
          <Controller
            name="person_last_name"
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                className={`w-full ${
                  errors.person_last_name ? "p-invalid" : ""
                }`}
              />
            )}
          />
          {errors.person_last_name && (
            <small className="p-error">{errors.person_last_name.message}</small>
          )}
        </div>

        {/* Age */}
        <div>
          <label>Age</label>
          <Controller
            name="person_age"
            control={control}
            render={({ field }) => (
              <InputNumber
                value={field.value ?? null} // Use null if value is undefined
                onValueChange={(e) => field.onChange(e.value)} // Correct handler
                className={`w-full ${errors.person_age ? "p-invalid" : ""}`}
                useGrouping={false}
                min={0}
              />
            )}
          />
          {errors.person_age && (
            <small className="p-error">{errors.person_age.message}</small>
          )}
        </div>

        {/* Gender */}
        <div>
          <label>Gender</label>
          <Controller
            name="person_gender"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={genderOptions}
                placeholder="Select Gender"
                className={`w-full ${errors.person_gender ? "p-invalid" : ""}`}
              />
            )}
          />
          {errors.person_gender && (
            <small className="p-error">{errors.person_gender.message}</small>
          )}
        </div>

        <Button type="submit" label="Add Person" className="w-full mt-3" />
      </form>
    </Dialog>
  );
}
