export type AdminRole = "SUPER_ADMIN" | "ADMIN";
export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "QUALIFIED" | "INVALID";
export type InsuranceType = "Medicare" | "ACA";

export type Lead = {
  id: string;
  _id?: string;
  leadId: string;
  first_name: string;
  last_name: string;
  dob: string;
  zip: string;
  state: string;
  gender: string;
  phone: string;
  email?: string;
  jornayaLeadId: string;
  jornaya_lead_id: string;
  ip_address: string;
  createdAt: string;
  updatedAt?: string;
  status: LeadStatus;
  insurance_type: InsuranceType;
  user_agent?: string;
  landing_page_url?: string;
  utm_source?: string;
  utm_campaign?: string;
  ip_geo_raw?: Record<string, unknown> | null;
  country?: string | null;
  city?: string | null;
  state_province?: string | null;
  zipcode?: string | null;
  isp?: string | null;
  timezone?: string | null;
  notes?: Note[];
};

export type Note = {
  _id: string;
  text: string;
  createdAt: string;
  admin_name: string;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  status: "ACTIVE" | "DISABLED";
  createdAt: string;
  lastLogin?: string;
};
