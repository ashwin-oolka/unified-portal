// app/api/cron-performance/route.ts
/* 
  Cron Analytics API
  Request (POST JSON):
    { "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }

  Response:
    {
      date: { "YYYY-MM-DD": { success: number, failed: number }, ... },
      error: { [errKey: string]: number },
      performance: [
        {
          job_name: string,
          execution: number,
          success_rate: string, // e.g. "96.4%"
          error: number,
          performance: number   // 3 = Excellent, 2 = Good, 1 = Needs Attention
        },
        ...
      ]
    }
*/

type DateMap = Record<string, { success: number; failed: number }>;
type ErrorMap = Record<string, number>;

interface RequestBody {
  startDate: string;
  endDate: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// util: inclusive date range, returned as "YYYY-MM-DD"
function daysBetween(start: Date, end: Date): string[] {
  const out: string[] = [];
  const cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const stop = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  while (cur.getTime() <= stop.getTime()) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

// tiny deterministic pseudo-random so data is stable for a given date/job
function seedish(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32; // [0,1)
}

// build daily series
function buildDailySeries(dates: string[]): DateMap {
  const map: DateMap = {};
  dates.forEach((d) => {
    const r = seedish(d);
    // tilt success around 85–100 with a bit of wobble
    const success = Math.max(5, Math.round(15 + r * 25)); // executions that failed
    const total = Math.round(90 + seedish(d + "t") * 40); // total executions per day
    const failed = Math.min(success, Math.max(0, Math.round((seedish(d + "f") * 0.18) * total)));
    const succ = Math.max(0, total - failed);
    map[d] = { success: succ, failed };
  });
  return map;
}

// build error pie from daily failures
function buildErrorMap(dateMap: DateMap): ErrorMap {
  const totalFailed = Object.values(dateMap).reduce((a, v) => a + v.failed, 0);
  // guard
  if (totalFailed === 0) return { Other: 1 };

  // fixed keys like in the mock
  const keys = ["API Timeout", "Invalid Parameters", "Network Error", "Authentication", "Other"];
  const weights = [0.35, 0.28, 0.2, 0.12, 0.05];

  const err: ErrorMap = {};
  let assigned = 0;
  for (let i = 0; i < keys.length; i++) {
    const count =
      i === keys.length - 1
        ? Math.max(0, totalFailed - assigned)
        : Math.round(totalFailed * weights[i]);
    err[keys[i]] = count;
    assigned += count;
  }
  return err;
}

// build per-job performance table (stable, deterministic)
function buildPerformance(dates: string[]) {
  const jobNames = [
    "HDFC Bill Fetch",
    "ICICI Bill Fetch",
    "SBI Bill Fetch",
    "Notification Sender",
    "WhatsApp Campaign",
  ];

  return jobNames.map((name, idx) => {
    const r = seedish(dates.join("|") + name);
    const exec = Math.max(5, Math.round(12 + r * 40));
    // base success bands similar to the screenshot
    const base =
      idx === 2 ? 0.86 : idx === 0 ? 0.965 : idx === 1 ? 0.952 : 1.0; // SBI lower; two good; two perfect
    const wobble = (seedish(name) - 0.5) * (idx === 2 ? 0.04 : 0.02);
    const rate = Math.max(0.6, Math.min(1, base + wobble));
    const errors = Math.max(0, Math.round(exec * (1 - rate)));
    const perfScore = rate >= 0.95 ? 3 : rate >= 0.9 ? 2 : 1;

    return {
      job_name: name,
      execution: exec,
      success_rate: `${(rate * 100).toFixed(1)}%`,
      error: errors,
      performance: perfScore,
    };
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<RequestBody>;
    const { startDate, endDate } = body;

    // Validate input
    if (!startDate || !endDate || !DATE_RE.test(startDate) || !DATE_RE.test(endDate)) {
      return new Response(
        JSON.stringify({
          error: "Invalid body. Expected { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }.",
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const start = new Date(startDate + "T00:00:00Z");
    const end = new Date(endDate + "T00:00:00Z");
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return new Response(JSON.stringify({ error: "Invalid date range." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const dates = daysBetween(start, end);

    // Special demo block to exactly mirror your screenshot sample if the range matches it
    if (startDate === "2025-08-10" && endDate === "2025-08-14") {
      const demo = {
        date: {
          "2025-08-10": { success: 8, failed: 4 },
          "2025-08-11": { success: 12, failed: 3 },
          "2025-08-12": { success: 16, failed: 5 },
          "2025-08-13": { success: 18, failed: 7 },
          "2025-08-14": { success: 20, failed: 6 },
        },
        error: {
          "API Timeout": 35,
          "Invalid Parameters": 28,
          "Network Error": 20,
          Authentication: 12,
          Other: 5,
        },
        performance: [
          { job_name: "HDFC Bill Fetch", execution: 28, success_rate: "96.4%", error: 1, performance: 3 },
          { job_name: "ICICI Bill Fetch", execution: 42, success_rate: "95.2%", error: 2, performance: 3 },
          { job_name: "SBI Bill Fetch", execution: 21, success_rate: "85.7%", error: 3, performance: 1 },
          { job_name: "Notification Sender", execution: 14, success_rate: "100.0%", error: 0, performance: 3 },
          { job_name: "WhatsApp Campaign", execution: 7, success_rate: "100.0%", error: 0, performance: 3 },
        ],
      };
      return new Response(JSON.stringify(demo), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    // Generated response for arbitrary ranges
    const date = buildDailySeries(dates);
    const error = buildErrorMap(date);
    const performance = buildPerformance(dates);

    return new Response(JSON.stringify({ date, error, performance }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Malformed JSON body." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

export function GET() {
  return new Response(
    JSON.stringify({
      message:
        "POST only. Send { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' } to receive cron analytics.",
      example_request: { startDate: "2025-08-10", endDate: "2025-08-14" },
    }),
    { status: 405, headers: { "content-type": "application/json" } }
  );
}
