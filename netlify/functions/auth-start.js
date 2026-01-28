const buildAuthUrl = (params) => {
  const domain = (process.env.AUTH0_DOMAIN || "").replace(/^https?:\/\//, "");
  if (!domain) {
    throw new Error("AUTH0_DOMAIN is not set");
  }

  const baseUrl = `https://${domain}/authorize`;
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

const getOriginFromEvent = (event) => {
  const origin = event.queryStringParameters?.origin;
  if (origin) {
    return origin;
  }

  const headerOrigin = event.headers?.origin;
  if (headerOrigin) {
    return headerOrigin;
  }

  const referer = event.headers?.referer || event.headers?.referrer;
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch (error) {
      return "";
    }
  }

  const host = event.headers?.host;
  return host ? `https://${host}` : "";
};

exports.handler = async (event) => {
  try {
    const provider = event.queryStringParameters?.provider || "github";
    const origin = getOriginFromEvent(event);
    const baseUrl = origin || process.env.URL || "";
    const state = Buffer.from(
      JSON.stringify({ origin: baseUrl || origin, provider })
    ).toString("base64url");

    const authUrl = buildAuthUrl({
      response_type: "code",
      client_id: process.env.AUTH0_CLIENT_ID,
      redirect_uri: process.env.AUTH0_CALLBACK_URL,
      scope: "openid profile email",
      state
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Authorization</title>
  </head>
  <body>
    <script>
      (function () {
        var provider = ${JSON.stringify(provider)};
        var origin = ${JSON.stringify(baseUrl || "*")};
        var authUrl = ${JSON.stringify(authUrl)};
        function beginAuth() {
          window.location.href = authUrl;
        }
        if (!window.opener) {
          beginAuth();
          return;
        }
        function receive(event) {
          if (origin !== "*" && event.origin !== origin) {
            return;
          }
          if (event.data === "authorizing:" + provider) {
            window.removeEventListener("message", receive, false);
            beginAuth();
          }
        }
        window.addEventListener("message", receive, false);
        window.opener.postMessage("authorizing:" + provider, origin);
        setTimeout(beginAuth, 2000);
      })();
    </script>
  </body>
</html>`
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Auth start failed."
    };
  }
};
