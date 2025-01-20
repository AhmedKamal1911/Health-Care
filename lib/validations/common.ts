import { z } from "zod";

export const dateValidation = z.preprocess(
  (v) => (typeof v === "string" ? new Date(v) : v),
  z.date()
);
