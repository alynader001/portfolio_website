import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://a.windbornesystems.com/treasure/00.json");
    if (!res.ok) throw new Error("Failed to fetch balloons");

    const data = await res.json();

    // Data is already an array, return as-is
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
