// api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // مسار الـ EB backend
  const EB_URL = `http://al-andalus-env.eba-amvf8spw.me-central-1.elasticbeanstalk.com${req.url.replace("/api/proxy", "")}`;

  try {
    const response = await fetch(EB_URL, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).send("Proxy Error: " + err.message);
  }
}
