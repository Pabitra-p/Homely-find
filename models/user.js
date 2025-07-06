const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const { required } = require("joi");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
