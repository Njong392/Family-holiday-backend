const savedAccommodation = require("../models/savedAccommodationsModel");
const mongoose = require("mongoose");

// //create a saved profile
// const createSavedAccommodation = async (req, res) => {
//   const { accommodation } = req.body;
//   const user_id = req.user._id;

//   try {
//     const savedAcc = await savedAccommodation.findOne({
//       user_id:user_id
//     });

//     if(!savedAcc){
//       const savedAccDetails= await savedAccommodation.create({
//         accommodation,
//         user_id
//       })

//       savedAcc = savedAccDetails.populate("accommodation")
//     } else{

//       const accommodationExists = savedAcc.accommodation.some(acc => acc === req.body._id)

//       if(accommodationExists){
//         // savedAcc.accommodation = savedAcc.accommodation.filter(acc => acc._id !== accommodation._id)

//         // savedAcc =await savedAccommodation.updateOne({user_id: user_id}, {$set: {accommodation: savedAcc.accommodation}})
//         console.log("exists")
//       } else{
//       //   savedAcc = await savedAccommodation.findOneAndUpdate({user_id: user_id }, {
//       //   $push:{
//       //     accommodation:{
//       //       $each: [accommodation]
//       //     }
//       //   }
//       // })
//       console.log("doesnt exist")

//     //   savedAcc= savedAcc.accommodation.push(accommodation);

//     // savedAcc = await savedAccommodation.updateOne({ user_id: user_id }, { $set: { accommodation: savedAcc } });
//       }
//     }

//     res.status(200).json(savedAcc);
//     console.log(savedAcc)
//   } catch (error) {
//     res.status(500).json({ error: "Whoops. Look like some server error occurred" });
//   }
// };

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

      savedAcc = savedAccDetails.populate("accommodation");
    } else {
      const accommodationExists = savedAcc.accommodation.some(
        (acc) => acc === req.body._id
      );
        

      if (accommodationExists) {
        console.log("exists");
      } else {
        savedAcc = await savedAccommodation.findOneAndUpdate(
          { user_id: user_id },
          {
            $push: {
              accommodation: {
                $each: [accommodation],
              },
            },
          }
        );
      }
    }

    res.status(200).json(savedAcc);
    console.log(savedAcc);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Whoops. Look like some server error occurred" });
  }
};



module.exports = {
  createSavedAccommodation,
  deleteSavedAccommodation,
};
