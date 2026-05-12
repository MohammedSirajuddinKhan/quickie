const express = require("express");
const { connectToMongoDB } = require("./connect.js");
const urlRoute = require("./routes/url.js");
const URL = require("./models/url.js");
const app = express();
const PORT = 3000;

connectToMongoDB(
  "mongodb+srv://siraj:l9xkzTQBS4Ow3hIb@sirajuddin.vy591k6.mongodb.net/quickie",
).then(() => {
  console.log("MONGODB CONNECTED SUCCESSFULLY");
});

app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
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
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
