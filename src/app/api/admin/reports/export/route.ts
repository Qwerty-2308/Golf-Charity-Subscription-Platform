import { getCurrentViewer } from "@/lib/session";
import { buildAdminCsv } from "@/lib/platform";

export async function GET() {
  const viewer = await getCurrentViewer();
  if (!viewer || viewer.profile.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const csv = buildAdminCsv();

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="good-drive-report.csv"',
    },
  });
}
