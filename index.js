require("dotenv").config();
const { connectToMongoDB } = require("./connect.js");
const app = require("./app.js");
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  if (!MONGODB_URI) {
    console.warn(
      "MONGODB_URI is not configured. The app will start, but database actions will fail until it is set.",
    );
  } else {
    await connectToMongoDB(MONGODB_URI);
    console.log("MONGODB CONNECTED SUCCESSFULLY");
  }

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  });
}

module.exports = app;
