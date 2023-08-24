const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const savedAccommodationSchema = new Schema({
  accommodation: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accommodation"
  }
  ],
  user_id: {
    type: String,
  },
});

module.exports = mongoose.model("savedAccommodation", savedAccommodationSchema);
