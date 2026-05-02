import { z } from "zod";

export const leadSubmissionSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  zip: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  state: z.string().min(2, "State is required"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  jornaya_lead_id: z.string().optional().or(z.literal("")),
  jornayaLeadId: z.string().optional().or(z.literal("")),
  consent: z.literal("on")
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const adminCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
  status: z.enum(["ACTIVE", "DISABLED"])
});
