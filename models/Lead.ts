import mongoose, { Schema, models, model } from "mongoose";

const NoteSchema = new Schema(
  {
    text: { type: String, required: true },
    admin_name: { type: String, required: true }
  },
  { timestamps: true }
);

const LeadSchema = new Schema(
  {
    _id: { type: String, required: true },
    id: { type: String, required: true, unique: true, index: true },
    leadId: { type: String, required: true, unique: true, index: true },
    first_name: { type: String, required: true, index: true },
    last_name: { type: String, required: true, index: true },
    dob: { type: String, required: true },
    zip: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    jornayaLeadId: { type: String, required: false, default: "", index: true },
    jornaya_lead_id: { type: String, required: false, default: "", index: true },
    ip_address: { type: String, required: true },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONVERTED", "QUALIFIED", "INVALID"],
      default: "NEW",
      index: true
    },
    insurance_type: { type: String, enum: ["Medicare", "ACA"], default: "Medicare", index: true },
    user_agent: { type: String, default: "" },
    landing_page_url: { type: String, default: "" },
    utm_source: { type: String, default: "" },
    utm_campaign: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    state_province: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    isp: { type: String, default: "" },
    timezone: { type: String, default: "" },
    ip_geo_raw: { type: Schema.Types.Mixed, default: null },
    notes: { type: [NoteSchema], default: [] }
  },
  { timestamps: true }
);

export default models.Lead || model("Lead", LeadSchema);
