import { Controller, useFieldArray } from "react-hook-form";

import { FormCategory, FormField } from "./FormTypes";
import { useCallback, useEffect, useState } from "react";
import { convertStreamToJson } from "./apiUtils";

export type NestedFieldsProps = {
  amount: number;
  errors: any;
  control: any; // TODO: create context
};

export function NestedFields({
  amount,
  errors,
  control,
}: NestedFieldsProps): JSX.Element {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "witnesses",
  });
  const [categories, setCategories] = useState<FormCategory[] | undefined>(
    undefined
  );

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");

      if (!response.ok || !response.body) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = response.body
        ? await convertStreamToJson<FormCategory[]>(response.body)
        : undefined;

      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <>
      <div>
        <label>Allocation</label>
        <Controller
          name={FormField.Amount}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              disabled={!amount}
              min="0"
              max={amount || 300}
              style={{ borderColor: errors.allocation ? "red" : "black" }}
            />
          )}
        />
        {errors.allocation && <span>{errors.allocation.message}</span>}
      </div>

      {categories ? (
        <div>
          <label>Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                style={{ borderColor: errors.category ? "red" : "black" }}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && <span>{errors.category.message}</span>}
        </div>
      ) : "Loading categories..."}

      <div>
        <label>Witnesses</label>
        {fields.map((field, index) => (
          <div key={field.id}>
            <Controller
              name={`witnesses.${index}.name`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Witness Name"
                  style={{
                    borderColor: errors.witnesses?.[index]?.name
                      ? "red"
                      : undefined,
                  }}
                />
              )}
            />
            {errors.witnesses?.[index]?.name && (
              <span>{errors.witnesses[index].name.message}</span>
            )}

            <Controller
              name={`witnesses.${index}.email`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Witness Email"
                  style={{
                    borderColor: errors.witnesses?.[index]?.email
                      ? "red"
                      : "black",
                  }}
                />
              )}
            />
            {errors.witnesses?.[index]?.email && (
              <span>{errors.witnesses[index].email.message}</span>
            )}

            <button type="button" onClick={() => remove(index)}>
              Remove Witness
            </button>
          </div>
        ))}

        {fields.length < 5 && (
          <button type="button" onClick={() => append({ name: "", email: "" })}>
            Add Witness
          </button>
        )}

        {errors.witnesses && <span>{errors.witnesses.message}</span>}
      </div>
    </>
  );
}
