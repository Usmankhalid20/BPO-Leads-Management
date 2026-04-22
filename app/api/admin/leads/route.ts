import { NextResponse } from "next/server";
import { getLeads } from "@/services/lead-service";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await verifyAuthToken(getTokenFromRequest(request));
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const { leads } = await getLeads(Object.fromEntries(searchParams.entries()));
  return NextResponse.json({ leads });
}
