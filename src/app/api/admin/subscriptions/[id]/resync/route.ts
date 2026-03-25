import { NextResponse } from "next/server";
import { getCurrentViewer } from "@/lib/session";
import { resyncSubscription } from "@/lib/platform";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const viewer = await getCurrentViewer();
  if (!viewer || viewer.profile.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const subscription = await resyncSubscription(id);
    return NextResponse.json(subscription);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Resync failed" },
      { status: 400 },
    );
  }
}
