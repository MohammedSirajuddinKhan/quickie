const express = require("express");
const path = require("path");
require("dotenv").config();
const { connectToMongoDB } = require("./connect.js");
const urlRoute = require("./routes/url.js");
const URL = require("./models/url.js");

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  if (!MONGODB_URI) {
    return res
      .status(500)
      .send(
        "MONGODB_URI is not configured. Set it in Vercel project environment variables and redeploy.",
      );
  }

  return next();
});

app.get("/", (req, res) => {
  res.render("index", {
    shortUrl: null,
    displayShortUrl: null,
    originalUrl: null,
    error: null,
  });
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  try {
    await connectToMongoDB(MONGODB_URI);
  } catch (error) {
    return res.status(500).render("index", {
      shortUrl: null,
      displayShortUrl: null,
      originalUrl: null,
      error:
        "Database connection failed. Check MONGODB_URI and Atlas access settings.",
    });
  }

  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    },
  );

  if (!entry) {
    return res.status(404).render("index", {
      shortUrl: null,
      displayShortUrl: null,
      originalUrl: null,
      error: "Short link not found.",
    });
  }

  return res.redirect(entry.redirectURL);
});

module.exports = app;
