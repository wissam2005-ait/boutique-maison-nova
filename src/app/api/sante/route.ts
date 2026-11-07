import { storageHealth } from "@/lib/db";

export async function GET() {
  const health = await storageHealth();
  return Response.json(
    { ...health, adminActive: Boolean(process.env.ADMIN_PASSWORD) },
    { status: health.ok ? 200 : 500, headers: { "Cache-Control": "no-store" } },
  );
}
