const jsonResponse = (statusCode, body = "") => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  },
  body
});

const parseBody = (body) => {
  if (!body) {
    return {};
  }
  try {
    return JSON.parse(body);
  } catch (error) {
    return {};
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204);
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, "Method Not Allowed");
  }

  const payload = parseBody(event.body);
  const logEntry = {
    receivedAt: new Date().toISOString(),
    ip:
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["x-forwarded-for"] ||
      "",
    userAgent: event.headers["user-agent"] || "",
    ...payload
  };

  console.log(JSON.stringify(logEntry));
  return jsonResponse(204);
};
