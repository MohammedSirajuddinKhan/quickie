const express = require("express");
const path = require("path");
require("dotenv").config();
const { connectToMongoDB } = require("./connect.js");
const urlRoute = require("./routes/url.js");
const URL = require("./models/url.js");

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
  await connectToMongoDB(MONGODB_URI);

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
