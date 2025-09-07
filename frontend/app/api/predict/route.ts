import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const yearRaw = body?.year;

    if (typeof yearRaw !== "number" || !Number.isFinite(yearRaw)) {
      return NextResponse.json({ error: "Invalid or missing 'year' (number required)" }, { status: 400 });
    }

    const YEAR_MIN = 1800;
    const YEAR_MAX = 2300;
    const year = Math.max(YEAR_MIN, Math.min(YEAR_MAX, Math.round(yearRaw)));

    // Simple mock model: linear warming trend from a baseline.
    const baseline = 14.0; // °C
    const trendPerYear = 0.018; // °C/year relative to 1990 (mock)
    const temperature = baseline + (year - 1990) * trendPerYear;

    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      year,
      temperature,
      unit: "°C",
      model: "MockLinearTrend v0",
    });
  }
  catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
