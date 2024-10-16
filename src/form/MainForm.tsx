import { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const damagedPartsOptions = ["roof", "front", "side", "rear"];

type FormData = {
  amount: number;
  allocation: number;
  damagedParts: (string | undefined)[];
  category?: string;
  witnesses?: WitnessDataEntry[];
};

type WitnessDataEntry = {
  name: string;
  email: string;
};

 enum FormField {
  Amount = "amount",
  Allocation = "allocation",
  DamagedParts = "damagedParts",
  Category = "category",
  Witnesses = "witnesses",
}

const initialValues: FormData = {
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

const schema = yup.object().shape({
  [FormField.Amount]: yup.number().min(0).max(300).required("Amount is required"),
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

export function MainForm(): JSX.Element {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const amount = watch(FormField.Amount);

  useEffect(() => {
    if (amount) {
      setValue(FormField.Allocation, Math.min(initialValues.allocation, amount));
    }
  }, [amount, setValue]);

  const onSubmit = useCallback((data: FormData) => {
    console.log(data);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Amount</label>
        <Controller
          name={FormField.Amount}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              min="0"
              max="300"
              style={{ borderColor: errors.amount ? "red" : "black" }}
            />
          )}
        />
        {errors.amount && <span>{errors.amount.message}</span>}
      </div>

      <div>
        <label>Damaged Parts</label>
        {damagedPartsOptions.map((option) => (
          <div key={option}>
            <Controller
              name={FormField.DamagedParts}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  value={option}
                  checked={field.value.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...field.value, option]
                      : field.value.filter(
                          (value: string | undefined) => value !== option
                        );
                    field.onChange(newValue);
                  }}
                />
              )}
            />
            <label>{option}</label>
          </div>
        ))}
        {errors.damagedParts && <span>{errors.damagedParts.message}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
