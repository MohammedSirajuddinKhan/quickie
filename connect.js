const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!global.mongooseConnectionPromise) {
    global.mongooseConnectionPromise = mongoose
      .connect(url, {
        serverSelectionTimeoutMS: 5000,
      })
      .catch((error) => {
        global.mongooseConnectionPromise = null;
        throw error;
      });
  }

  await global.mongooseConnectionPromise;
  return mongoose.connection;
}

module.exports = {
  connectToMongoDB,
};
