import "./App.css";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainForm } from "./form/MainForm";
import { initialValues } from "./form/FormInitialData";
import { FormField } from "./form/FormTypes";

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


function App() {
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <MainForm />
    </FormProvider>
  );
}

export default App;
