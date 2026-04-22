import { connectDB } from "@/lib/db";
import LeadModel from "@/models/Lead";
import type { Lead, LeadStatus } from "@/types";

function normalizeLead(doc: any): Lead {
  const lead = doc?.toObject ? doc.toObject() : doc;
  if (!lead) return lead;
  return {
    ...lead,
    id: String(lead._id),
    _id: String(lead._id),
    createdAt: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : String(lead.createdAt),
    updatedAt: lead.updatedAt ? (lead.updatedAt instanceof Date ? lead.updatedAt.toISOString() : String(lead.updatedAt)) : undefined,
    notes: (lead.notes || []).map((note: any) => ({
      ...note,
      _id: String(note._id),
      createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : String(note.createdAt)
    }))
  };
}

export async function createLead(data: Omit<Lead, "_id" | "createdAt" | "updatedAt" | "status" | "insurance_type" | "notes"> & {
  status?: LeadStatus;
  insurance_type?: "Medicare" | "ACA";
  user_agent?: string;
  landing_page_url?: string;
  utm_source?: string;
  utm_campaign?: string;
  ip_geo_raw?: Record<string, unknown> | null;
}) {
  await connectDB();
  const lead = await LeadModel.create({
    _id: data.id,
    ...data,
    email: data.email || "",
    country: data.country || "",
    city: data.city || "",
    state_province: data.state_province || "",
    zipcode: data.zipcode || "",
    isp: data.isp || "",
    timezone: data.timezone || "",
    status: data.status || "NEW",
    insurance_type: data.insurance_type || "Medicare",
    ip_geo_raw: data.ip_geo_raw ?? null
  });
  return normalizeLead(lead);
}

export async function getLeads(filter: Record<string, string | string[] | undefined> = {}) {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filter.id) {
    query._id = String(filter.id);
  }
  if (filter.search) {
    const search = String(filter.search).trim();
    query.$or = [
      { first_name: new RegExp(search, "i") },
      { last_name: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { jornaya_lead_id: new RegExp(search, "i") }
    ];
  }
  if (filter.state) query.state = filter.state;
  if (filter.gender) query.gender = filter.gender;
  if (filter.status) query.status = filter.status;
  if (filter.insurance_type) query.insurance_type = filter.insurance_type;
  if (filter.from || filter.to) {
    query.createdAt = {};
    if (filter.from) (query.createdAt as Record<string, unknown>).$gte = new Date(String(filter.from));
    if (filter.to) (query.createdAt as Record<string, unknown>).$lte = new Date(String(filter.to));
  }

  const page = Math.max(Number(filter.page || 1), 1);
  const limit = Math.min(Math.max(Number(filter.limit || 25), 1), 100);
  const total = await LeadModel.countDocuments(query);
  const leads = await LeadModel.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
  return { leads: leads.map((lead) => normalizeLead(lead)), total, page, limit };
}

export async function getLeadById(id: string) {
  await connectDB();
  const lead = await LeadModel.findById(id).lean();
  return lead ? normalizeLead(lead) : null;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await connectDB();
  return LeadModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
}

export async function addLeadNote(id: string, text: string, admin_name: string) {
  await connectDB();
  return LeadModel.findByIdAndUpdate(
    id,
    { $push: { notes: { text, admin_name, createdAt: new Date().toISOString() } } },
    { new: true }
  ).lean();
}

export async function getLeadMetrics() {
  await connectDB();
  const total = await LeadModel.countDocuments();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayLeads = await LeadModel.countDocuments({ createdAt: { $gte: todayStart } });
  const medicareLeads = await LeadModel.countDocuments({ insurance_type: "Medicare" });
  const acaLeads = await LeadModel.countDocuments({ insurance_type: "ACA" });
  const stateBuckets = await LeadModel.aggregate([
    { $group: { _id: "$state", value: { $sum: 1 } } },
    { $sort: { value: -1 } }
  ]);
  const dayBuckets = await LeadModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { date: "$createdAt", format: "%Y-%m-%d" }
        },
        leads: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  const dayMap = new Map(dayBuckets.map((item) => [item._id, item.leads]));
  const filledDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      leads: dayMap.get(dateKey) || 0
    };
  });

  return {
    total,
    todayLeads,
    medicareLeads,
    acaLeads,
    stateBuckets: stateBuckets.map((item) => ({ name: item._id, value: item.value })),
    dayBuckets: filledDays
  };
}
