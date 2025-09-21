import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing latitude or longitude" }, { status: 400 });
    }

    const key = process.env.TIMEZONEDB_KEY;
    if (!key) {
      return NextResponse.json({ error: "API key not set" }, { status: 500 });
    }

    const res = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=position&lat=${lat}&lng=${lon}`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from TimeZoneDB" }, { status: 500 });
    }

    const data = await res.json();

    // Return only the relevant fields
    return NextResponse.json({
      formatted: data.formatted, // e.g., "2025-09-21 12:34:56"
      zoneName: data.zoneName,   // e.g., "America/New_York"
      abbreviation: data.abbreviation,
      gmtOffset: data.gmtOffset,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
