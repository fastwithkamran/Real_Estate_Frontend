export default async function handler(req, res) {
  try {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      console.error("Backend API not found");
      return res.status(500).json({ msg: "Backend API not found" });
    }

    const urlObj = new URL(req.url, "http://localhost");
    const originalPath = urlObj.searchParams.get("__path") || "";
    urlObj.searchParams.delete("__path");
    const remainingQuery = urlObj.searchParams.toString();
    const targetPath = `/${originalPath}${remainingQuery ? "?" + remainingQuery : ""}`;
    const targetUrl = `${backendUrl}${targetPath}`;


    const forwardHeaders = {};

    if (req.headers["content-type"]) {
      forwardHeaders["content-type"] = req.headers["content-type"];
    }

    if (req.headers["cookie"]) {
      forwardHeaders["cookie"] = req.headers["cookie"];
    }

    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
    };

    if (req.method !== "GET") {
      fetchOptions.body = req;
      fetchOptions.duplex = "half";
    }

    const backendResponse = await fetch(targetUrl, fetchOptions);

    const setCookie = backendResponse.headers.get("set-cookie");
    if (setCookie) res.setHeader("Set-Cookie", setCookie);

    const contentType = backendResponse.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    res.status(backendResponse.status);
    const body = await backendResponse.arrayBuffer();
    res.end(Buffer.from(body));
  } catch (error) {
    console.error("Backend not responding ", error.message);
    res.status(502).json({ msg: "Backend not responding" });
  }
}
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
