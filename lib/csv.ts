import { stringify } from "csv-stringify/sync";
import type { Lead } from "@/types";

export function leadsToCsv(leads: Lead[]) {
  return stringify(
    leads.map((lead) => ({
      id: lead.id,
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email || "",
      phone: lead.phone,
      zip: lead.zip,
      state: lead.state,
      dob: lead.dob,
      gender: lead.gender,
      created_at: lead.createdAt,
      lead_id: lead.leadId || lead.id,
      jornayaLeadId: lead.jornayaLeadId || lead.jornaya_lead_id,
      jornaya_lead_id: lead.jornayaLeadId || lead.jornaya_lead_id,
      ip_address: lead.ip_address,
      country: lead.country || "",
      city: lead.city || "",
      state_province: lead.state_province || "",
      zipcode: lead.zipcode || "",
      isp: lead.isp || "",
      timezone: lead.timezone || "",
      status: lead.status,
      insurance_type: lead.insurance_type,
      utm_source: lead.utm_source || "",
      utm_campaign: lead.utm_campaign || "",
      landing_page_url: lead.landing_page_url || ""
    })),
    { header: true }
  );
}
