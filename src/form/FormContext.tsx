import React, { createContext, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormData, FormField } from "./FormTypes";
import { initialValues } from "./FormInitialData";

const schema = yup.object().shape({
  [FormField.Amount]: yup
    .number()
    .min(0)
    .max(300)
    .required("Amount is required"),
  [FormField.Allocation]: yup
    .number()
    .min(0)
    .max(yup.ref("amount"))
    .required("Allocation is required"),
  [FormField.DamagedParts]: yup
    .array()
    .of(yup.string())
    .required("Damaged parts are required"),
  [FormField.Witnesses]: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Witness name is required"),
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
      })
    )
    .min(1, "At least one witness is required")
    .max(5, "No more than 5 witnesses"),
});

type FormContextType = UseFormReturn<FormData> & {};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context;
};

type FormProviderProps = {
  children: React.ReactNode;
};

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
};
