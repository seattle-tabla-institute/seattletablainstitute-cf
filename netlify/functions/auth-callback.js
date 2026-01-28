const fetchUserInfo = async (domain, accessToken) => {
  const response = await fetch(`https://${domain}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  return response.json();
};

const exchangeCodeForToken = async (domain, code) => {
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: process.env.AUTH0_CALLBACK_URL
    })
  });

  if (!response.ok) {
    throw new Error("Token exchange failed");
  }

  return response.json();
};

const parseState = (state) => {
  if (!state) {
    return {};
  }
  try {
    const json = Buffer.from(state, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch (error) {
    return {};
  }
};

const getOriginFromEvent = (event) => {
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

const isEmailAllowed = (email) => {
  const allowed = (process.env.CMS_ALLOWED_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.length) {
    return true;
  }
  return allowed.includes((email || "").toLowerCase());
};

exports.handler = async (event) => {
  const stateData = parseState(event.queryStringParameters?.state);
  const provider = stateData.provider || "github";
  const fallbackOrigin =
    process.env.URL || process.env.DEPLOY_PRIME_URL || getOriginFromEvent(event);
  const origin = stateData.origin || fallbackOrigin || "*";

  const respondWithAuth = (status, payload) => {
    const message = `authorization:${provider}:${status}:${JSON.stringify(
      payload
    )}`;
    const body = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Authorization</title>
  </head>
  <body>
    <script>
      (function () {
        var message = ${JSON.stringify(message)};
        var origin = ${JSON.stringify(origin)};
        if (window.opener) {
          window.opener.postMessage(message, origin);
        }
        window.close();
      })();
    </script>
  </body>
</html>`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body
    };
  };

  try {
    const domain = (process.env.AUTH0_DOMAIN || "").replace(/^https?:\/\//, "");
    const githubToken = process.env.GITHUB_TOKEN;
    if (!domain || !githubToken) {
      return respondWithAuth("error", {
        message: "Auth configuration missing."
      });
    }

    const code = event.queryStringParameters?.code;
    if (!code) {
      return respondWithAuth("error", { message: "Missing code." });
    }

    const tokenData = await exchangeCodeForToken(domain, code);
    const userInfo = await fetchUserInfo(domain, tokenData.access_token);
    const email = userInfo.email;

    if (!email || !isEmailAllowed(email)) {
      return respondWithAuth("error", { message: "Unauthorized." });
    }

    const payload = { token: githubToken, provider: "github" };
    return respondWithAuth("success", payload);
  } catch (error) {
    return respondWithAuth("error", { message: "Auth callback failed." });
  }
};
