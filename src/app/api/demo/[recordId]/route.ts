import { NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Restaurants";

const FIELDS: Record<string, string> = {
  nom: "Nom",
  adresse: "Adresse",
  ville: "Ville",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ recordId: string }> }
) {
  const { recordId } = await params;
  if (!recordId || !AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return NextResponse.json(
      { error: "Config or recordId missing" },
      { status: 400 }
    );
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Record not found" },
      { status: res.status }
    );
  }

  const data = (await res.json()) as { fields?: Record<string, unknown> };
  const fields = data.fields || {};
  const name = (fields[FIELDS.nom] ?? fields["Nom"]) as string | undefined;
  const address = (fields[FIELDS.adresse] ?? fields["Adresse"]) as string | undefined;
  const city = (fields[FIELDS.ville] ?? fields["Ville"]) as string | undefined;

  return NextResponse.json({
    name: name || "Restaurant",
    address: address || "",
    city: city || "",
  });
}
