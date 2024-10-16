export type FormData = {
  amount: number;
  allocation: number;
  damagedParts: (string | undefined)[];
  category?: string;
  witnesses?: WitnessDataEntry[];
};

export type WitnessDataEntry = {
  name: string;
  email: string;
};

export enum FormField {
  Amount = "amount",
  Allocation = "allocation",
  DamagedParts = "damagedParts",
  Category = "category",
  Witnesses = "witnesses",
}

export type FormCategory = {
  slug: string;
  name: string;
  url: string;
};
