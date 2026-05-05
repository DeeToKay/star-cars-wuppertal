import { z } from "zod";

const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
const licensePlateRegex = /^[A-ZÄÖÜ]{1,3}[\s\-]?[A-ZÄÖÜ]{1,2}[\s\-]?\d{1,4}$/i;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Bitte den vollständigen Namen eingeben.")
    .max(80, "Name ist zu lang."),
  email: z
    .string()
    .trim()
    .min(1, "E-Mail ist erforderlich.")
    .email("Bitte eine gültige E-Mail-Adresse eingeben."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Bitte eine gültige Telefonnummer eingeben (z.B. +49 202 123456)."),
  licensePlate: z
    .string()
    .trim()
    .max(12, "Kennzeichen ist zu lang.")
    .refine(
      (v) => v === "" || licensePlateRegex.test(v),
      "Bitte ein gültiges deutsches Kennzeichen eingeben (z.B. WU AB 1234)."
    )
    .optional()
    .default(""),
  agbAccepted: z
    .literal(true, { errorMap: () => ({ message: "Bitte AGB und Datenschutzerklärung akzeptieren." }) }),
});

export function validateContact(values) {
  const result = contactSchema.safeParse(values);
  if (result.success) return { ok: true, data: result.data };
  const fieldErrors = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0];
    if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
  }
  return { ok: false, fieldErrors, message: result.error.issues[0]?.message };
}
