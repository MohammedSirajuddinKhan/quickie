require("dotenv").config();
const { connectToMongoDB } = require("./connect.js");
const app = require("./app.js");
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

connectToMongoDB(MONGODB_URI).then(() => {
  console.log("MONGODB CONNECTED SUCCESSFULLY");
});

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
