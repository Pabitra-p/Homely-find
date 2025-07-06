const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { insertMany } = require("../models/listing");

const mongo_Url = "mongodb://127.0.0.1:27017/homely-find";
async function main() {
  await mongoose.connect(mongo_Url);
}

main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6650a87ff9430f5539baf2ff",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};
initDb();
