import { FormField, FormData } from "./FormTypes";

export const initialValues: FormData = {
  [FormField.Amount]: 250,
  [FormField.Allocation]: 140,
  [FormField.DamagedParts]: ["side", "rear"],
  [FormField.Category]: "kitchen-accessories",
  [FormField.Witnesses]: [
    {
      name: "Marek",
      email: "marek@email.cz",
    },
    {
      name: "Emily",
      email: "emily.johnson@x.dummyjson.com",
    },
  ],
};
