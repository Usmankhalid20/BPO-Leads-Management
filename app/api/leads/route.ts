import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { leadSubmissionSchema } from "@/lib/validators";
import { createLead } from "@/services/lead-service";
import { getRequestIP, getUserAgent } from "@/lib/ip";
import { enrichIpAddress } from "@/lib/ipgeolocation";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const parsed = leadSubmissionSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid submission" }, { status: 400 });
    }

    const requestIp = getRequestIP(request);
    const ipLookup = await enrichIpAddress(requestIp);
    const referenceId = randomUUID();
    const jornayaLeadId = String(data.jornayaLeadId || data.jornaya_lead_id || "").trim() || randomUUID();

    const lead = await createLead({
      id: referenceId,
      leadId: referenceId,
      first_name: String(data.first_name),
      last_name: String(data.last_name),
      dob: String(data.dob),
      zip: String(data.zip),
      state: String(data.state),
      gender: String(data.gender),
      phone: String(data.phone),
      email: String(data.email || ""),
      jornayaLeadId,
      jornaya_lead_id: jornayaLeadId,
      ip_address: ipLookup.ip_address,
      country: ipLookup.country,
      city: ipLookup.city,
      state_province: ipLookup.state_province,
      zipcode: ipLookup.zipcode,
      isp: ipLookup.isp,
      timezone: ipLookup.timezone,
      user_agent: getUserAgent(request),
      landing_page_url: String(data.landing_page_url || ""),
      utm_source: String(data.utm_source || ""),
      utm_campaign: String(data.utm_campaign || ""),
      ip_geo_raw: ipLookup.ip_geo_raw,
      status: "NEW",
      insurance_type: "Medicare"
    });

    return NextResponse.json({ ok: true, id: lead.id, leadId: lead.id, jornayaLeadId: lead.jornaya_lead_id, jornaya_lead_id: lead.jornaya_lead_id });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
