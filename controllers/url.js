const { nanoid } = require("nanoid");
const URL = require("../models/url.js");
const { connectToMongoDB } = require("../connect.js");

async function handleGenerateNewShortUrl(req, res) {
  const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://quickie";
  const localBaseUrl = `${req.protocol}://${req.get("host")}`;
  const mongoUri = process.env.MONGODB_URI;

  await connectToMongoDB(mongoUri);

  const body = req.body;
  if (!body.url)
    return res.status(400).render("index", {
      shortUrl: null,
      shortId: null,
      originalUrl: null,
      error: "A destination URL is required.",
    });
  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.render("index", {
    shortUrl: `${localBaseUrl}/${shortID}`,
    displayShortUrl: `${publicBaseUrl}/${shortID}`,
    shortId: shortID,
    originalUrl: body.url,
    error: null,
  });
}

async function handleGetAnalytics(req, res) {
  await connectToMongoDB(process.env.MONGODB_URI);

  const shortId = req.params.shortId;
  const result = await URL.findOne({
    shortId,
  });

  if (!result) {
    return res.status(404).render("analytics", {
      shortId,
      totalClicks: 0,
      analytics: [],
      error: "Short URL not found.",
    });
  }

  return res.render("analytics", {
    shortId,
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
    error: null,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
