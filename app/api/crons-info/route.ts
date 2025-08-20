import { NextResponse } from "next/server"

export async function GET() {
  // TODO: replace this with real data from your service/DB when ready
  const demoResponse = {
    jobs: [
      {
        name: "BAJA Bill Fetch",
        status: 1,
        rate: { success: 7, failed: 1 },
        schedule: "Daily at 04:00 AM",
      },
      {
        name: "Credit Card Bill Fetch",
        status: 1,
        rate: { success: 3, failed: 3 },
        schedule: "Daily at 01:00 AM",
      },
      {
        name: "SBI Bill Fetch",
        status: 0,
        rate: { success: 1848, failed: 156 },
        schedule: "Every 8 hours",
      },
    ],
  }

  return NextResponse.json(demoResponse)
}
