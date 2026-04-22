import { NextResponse } from "next/server";
import { getLeads } from "@/services/lead-service";
import { leadsToCsv } from "@/lib/csv";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await verifyAuthToken(getTokenFromRequest(request));
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const filters = Object.fromEntries(searchParams.entries());
  delete filters.page;
  delete filters.limit;
  const { leads } = await getLeads(filters);
  const csv = leadsToCsv(leads);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="leads.csv"'
    }
  });
}
