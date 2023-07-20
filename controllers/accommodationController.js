const Accommodation = require("../models/accomodationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../services/cloudinary");

//create an accommodation
const createAccommodation = async (req, res) => {
  const {
    country,
    city,
    bedrooms,
    beds,
    bathrooms,
    maxOfGuests,
    arrivalDate,
    departureDate,
    image,
    houseRules,
    description,
    pricePerNight,
  } = req.body;

  //add doc to db
  try {
    let imageData = {};

    if (image) {
      const results = await uploadToCloudinary(image, "family_accommodation");
      imageData = results;
      console.log(imageData);
    }

    const user_id = req.user._id;
    const accommodation = await Accommodation.create({
      country,
      city,
      bedrooms,
      beds,
      bathrooms,
      maxOfGuests,
      arrivalDate,
      departureDate,
      houseRules,
      description,
      image: imageData,
      pricePerNight,
      user_id,
    });

    const user = await User.findById(user_id);
    user.isHost = true;
    await user.save();

    res.status(200).json(accommodation);
    console.log(imageData);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

const getAccommodations = async (req, res) => {
  const userId = req.query.userId;

  try{
    const accommodations = await Accommodation.find({ user_id: userId });

  if (!accommodations) {
    return res.status(404).json({ error: "No such accommodations" });
  }

  res.status(200).json(accommodations);
  } catch(error){
    return res.status(500).json({ error: error.message })
  }
};

//get single accommodation
const getAccommodation = async (req, res) => {
  const { id } = req.params;

  try{
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "yada yada" });
  }

  const accommodation = await Accommodation.findById(id);

  if (!accommodation) {
    return res.status(404).json({ error: "No such accommodation" });
  }

  res.status(200).json(accommodation);
  } catch(error){
    return res.status(500).json({ error: error.message })
  }
};

//update an accommodation
const updateAccommodation = async (req, res) => {
  const { id } = req.params;

  try{
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such id" });
  }

  const accommodation = await Accommodation.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
  );

  if (!accommodation) {
    return res.status(400).json({ error: "No such accommodation" });
  }

  res.status(200).json(accommodation);
  } catch(error){
    return res.status(500).json({ error: error.message })
  }
};

//delete an accommodation
const deleteAccommodation = async (req, res) => {
  const { id } = req.params;

 try{
   if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such id" });
  }

  const accommodation = await Accommodation.findOneAndDelete({ _id: id });

  if (!accommodation) {
    return res.status(400).json({ error: "No such accommodation" });
  }

  
  res.status(200).json(accommodation);
 } catch(error){
   return res.status(500).json({ error: error.message })
 }

};

//get hosts based on filter
const getAccommodationsByFilter = async (req, res) => {
  const destination = req.query.destination;
  const numberOfGuests = req.query.numberOfGuests;
  const budget = req.query.budget;
  const arrivalDate = req.query.arrivalDate;
  const departureDate = req.query.departureDate;

  const range = 0;

  try {
    const filteredAccommodations = await Accommodation.find({
      $or: [
        { country: destination },
        { maxOfGuests: numberOfGuests },
        { pricePerNight: { $in: [range, budget] } },
        { arrivalDate: arrivalDate },
        { departureDate: departureDate },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(filteredAccommodations);
    console.log(filteredAccommodations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodation,
  updateAccommodation,
  deleteAccommodation,
  getAccommodationsByFilter,
};
