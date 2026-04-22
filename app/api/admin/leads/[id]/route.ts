import { NextResponse } from "next/server";
import { addLeadNote, getLeadById, updateLeadStatus } from "@/services/lead-service";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAuthToken(getTokenFromRequest(request));
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const lead = await getLeadById(params.id);
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await verifyAuthToken(getTokenFromRequest(request));
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  if (body.status) {
    const lead = await updateLeadStatus(params.id, body.status);
    return NextResponse.json({ lead });
  }
  if (body.note) {
    const lead = await addLeadNote(params.id, body.note, body.admin_name || "Admin");
    return NextResponse.json({ lead });
  }
  return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
}
