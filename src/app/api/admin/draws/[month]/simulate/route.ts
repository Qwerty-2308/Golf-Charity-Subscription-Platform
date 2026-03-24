import { NextResponse } from "next/server";
import { getCurrentViewer } from "@/lib/session";
import { simulateMonthlyDraw } from "@/lib/platform";
import type { DrawMode, FrequencyBias } from "@/lib/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ month: string }> },
) {
  const viewer = await getCurrentViewer();
  if (!viewer || viewer.profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { month } = await params;
  const body = await request.json().catch(() => ({}));
  const summary = simulateMonthlyDraw({
    monthKey: month,
    mode: (body.mode as DrawMode) ?? "algorithmic",
    bias: (body.bias as FrequencyBias) ?? "most_frequent",
  });

  return NextResponse.json(summary);
}
