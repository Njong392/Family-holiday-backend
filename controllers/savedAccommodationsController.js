const savedAccommodation = require("../models/savedAccommodationsModel");
const mongoose = require("mongoose");

//delete a saved accommodation
const deleteSavedAccommodation = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ error: "No saved accommodation with that id" });
  }

  try {
    const deletedAcc = await savedAccommodation.findOneAndDelete({ _id: id });
    res.status(200).json(deletedAcc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get saved accommodations
const getSavedAccommodations = async (req, res) => {
  const user_id = req.user._id;

  try {
    const savedAcc = await savedAccommodation.findOne({
      user_id: user_id,
    });

    if (!savedAcc) {
      return res.status(200).json([]);
    }

    res.status(200).json(savedAcc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create saved accommodation
const createSavedAccommodation = async (req, res) => {
  const { accommodation } = req.body;
  const user_id = req.user._id;
  
  try {
    const savedAcc = await savedAccommodation.findOne({
      user_id: user_id,
    });

    if (!savedAcc) {
      const savedAccDetails = await savedAccommodation.create({
        accommodation,
        user_id,
      });

      savedAccDetails = await savedAccDetails.populate("accommodation");
    } else {
      const accommodationExists = savedAcc.accommodation.some(
        (acc) => acc._id.toString() === accommodation._id
      );
        

      if (accommodationExists) {
        savedAcc = await savedAccommodation.findOneAndUpdate(
          { user_id: user_id },
          {
            $pull: {
              accommodation: {
                _id: accommodation._id,
              },
            },
          }
        );
      } else {
        savedAcc = await savedAccommodation
          .findOneAndUpdate(
            { user_id: user_id },
            {
              $push: {
                accommodation: {
                  $each: [accommodation],
                },
              },
            }
          )
          
        
        savedAcc = await savedAcc.populate("accommodation");
        
      }
    }

    res.status(200).json(savedAcc);
    //console.log(savedAcc);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Whoops. Look like some server error occurred" });
  }
};



module.exports = {
  createSavedAccommodation,
  deleteSavedAccommodation,
  getSavedAccommodations
};
