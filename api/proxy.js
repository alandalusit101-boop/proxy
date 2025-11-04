// api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // إزالة /api/proxy من المسار الأصلي
    const path = req.url.replace("/api/proxy", "");
    const EB_URL = `http://al-andalus-env.eba-amvf8spw.me-central-1.elasticbeanstalk.com${path}`;

    // تحضير body
    let body;
    if (req.method !== "GET" && req.method !== "HEAD") {
      // إذا كان JSON
      body = JSON.stringify(req.body);
    }

    // تحضير headers مع إزالة headers التي قد تسبب مشاكل
    const headers = { ...req.headers };
    delete headers.host; // مهم
    delete headers["content-length"]; // Vercel سيحسبها تلقائيًا

    // تنفيذ الطلب إلى EB
    const response = await fetch(EB_URL, {
      method: req.method,
      headers,
      body,
    });

    // تمرير نوع المحتوى تلقائيًا
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const data = await response.text();
    res.send(data);

  } catch (err) {
    res.status(500).json({ error: "Proxy Error", message: err.message });
  }
}
