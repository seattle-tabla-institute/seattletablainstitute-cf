const buildHeaders = (overrides: Record<string, string> = {}) => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  ...overrides
});

const parseBody = async (request: Request) => {
  try {
    return await request.json();
  } catch (error) {
    return {};
  }
};

export const prerender = false;

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: buildHeaders() });
}

export async function GET() {
  return new Response(null, { status: 204, headers: buildHeaders() });
}

export async function POST({ request }: { request: Request }) {
  const payload = await parseBody(request);
  const logEntry = {
    receivedAt: new Date().toISOString(),
    ip: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "",
    userAgent: request.headers.get("user-agent") || "",
    ...payload
  };

  console.log(JSON.stringify(logEntry));
  return new Response(null, { status: 204, headers: buildHeaders() });
}
