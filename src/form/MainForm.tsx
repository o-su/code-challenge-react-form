import { useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";

import { FormField, FormData } from "./FormTypes";
import { initialValues } from "./FormInitialData";
import { NestedFields } from "./NestedFields";
import { useFormContext } from "./FormContext";

const damagedPartsOptions = ["roof", "front", "side", "rear"];

export function MainForm(): JSX.Element {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const amount = watch(FormField.Amount);

  useEffect(() => {
    if (amount) {
      setValue(
        FormField.Allocation,
        Math.min(initialValues.allocation, amount)
      );
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

      <NestedFields amount={amount} />

      <button type="submit">Submit</button>
    </form>
  );
}
