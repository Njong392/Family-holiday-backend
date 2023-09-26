const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
const { sendVerficationMail } = require("../utils/sendVerificationMail");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirm_password: {
      type: String,
      required: true,
    },
    default_profile: {
      type: String,
      default: ""
    },
    form: [
      {
        isFilled: {
          type: String,
        },
        hobby: {
          type: [String],
        },
        allergy: {
          type: [String],
        },
        language: {
          type: [String],
        },
        pet: {
          type: [String],
        },
        adults: {
          type: Number,
        },
        children: {
          type: Number,
        },
        cuisine: {
          type: String,
        },
        bio: {
          type: String,
        },
        image: 
          {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          }
        }
        
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isHost: {
      type: Boolean,
      default: false,
    },
    isDisabled:{
      type: Boolean,
      default: false
    },
    emailToken: {
      type: String,
    },
  },
  { timestamps: true },
);

//static sign up meethod
userSchema.statics.signup = async function (
  first_name,
  last_name,
  country,
  city,
  email,
  password,
  confirm_password,
) {
  //validation
  if (
    !first_name ||
    !last_name ||
    !country ||
    !city ||
    !email ||
    !password ||
    !confirm_password
  ) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email must be a valid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password is not strong enough. Try a combination of lowercase, uppercase, numbers, and symbols",
    );
  }

  if (password !== confirm_password) {
    throw Error("Passwords do not match");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    if(exists.isDisabled){
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      exists.isDisabled = false
      exists.first_name = first_name
      exists.last_name = last_name
      exists.country = country
      exists.city = city
      exists.password = hash
      exists.confirm_password = hash
     

    await exists.save()

    return exists
    
    } else{
       throw Error("Oops. This email already exists")
    }

  }
  else{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
      first_name,
      last_name,
      country,
      city,
      email,
      password: hash,
      confirm_password: hash,
      emailToken: crypto.randomBytes(64).toString("hex"),
  });

  sendVerficationMail(user);
  return user;

  }


};

//static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("This email does not exist. Please check that it is correct");
  }

  if(user.isDisabled){
    throw Error("This email has been deactivated. Try creating your account again.")
  } else{
    const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid password");
  }

  return user;
  }

};

module.exports = mongoose.model("user", userSchema);
