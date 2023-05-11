require('dotenv').config();

const { mongoose } = require('mongoose');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser')
const { uploadTocloudinary } = require('../services/cloudinary');

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '2d' });
};

//sign up user
const signupUser = async (req, res) => {
  const {
    first_name,
    last_name,
    country,
    city,
    email,
    password,
    confirm_password,
  } = req.body;

  //add doc to db
  try {
    const user = await User.signup(
      first_name,
      last_name,
      country,
      city,
      email,
      password,
      confirm_password
    );

    //create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//log in user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update a user
const updateHost = async (req, res) => {
  req.params = req.user._id;

  let { hobby, allergy, language, numberOfPeople, cuisine, bio, image } =
    req.body;

  let emptyFields = [];

  if (!hobby) {
    emptyFields.push('hobby');
  }

  if (!allergy) {
    emptyFields.push('allergy');
  }

  if (!language) {
    emptyFields.push('language');
  }

  if (!numberOfPeople) {
    emptyFields.push('numberOfPeople');
  }

  if (!cuisine) {
    emptyFields.push('cuisine');
  }

  if (!bio) {
    emptyFields.push('bio');
  }

  if (!image) {
    emptyFields.push('image');
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  if (numberOfPeople < 1) {
    return res
      .status(400)
      .json({ error: 'Number of family members must be greater than 1' });
  }

  try {
    let imageData = {};

    if (!mongoose.Types.ObjectId.isValid(req.params)) {
      return res.status(404).json({ error: 'No such user' });
    }

    if (image) {
      const results = await uploadTocloudinary(image, 'family_users');
      imageData = results;
      console.log(imageData);
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params },
      {
        $push: {
          form: {
            role: 'host',
            hobby,
            allergy,
            language,
            numberOfPeople,
            cuisine,
            bio,
            image: imageData,
          },
        },
      }
    );

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    console.log(user);
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'A server occurred with this request' });
  }
};

//get a user
const getUser = async (req, res) => {
  // req.params = req.user._id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid user id' });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: 'No such user' });
  }

  res.status(200).json(user);
  console.log(typeof user.form);
};

module.exports = {
  signupUser,
  loginUser,
  updateHost,
  getUser,
};
