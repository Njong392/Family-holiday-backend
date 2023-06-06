require('dotenv').config()

const { mongoose  } = require('mongoose')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
//const cookieParser = require('cookie-parser')
const {uploadToCloudinary} = require('../services/cloudinary')

const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET)
}

//sign up user
const signupUser = async (req, res) => {
    const {first_name, last_name, country, city, email, password, confirm_password} = req.body

    //add doc to db
    try{
        const user = await User.signup(first_name, last_name, country, city, email, password, confirm_password)

        //create a token
        const token = createToken(user._id)

        res.status(200).json({email, token, id:user._id, isVerified: user.isVerified})
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

//log in user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.login(email, password)

        //create a token
        const token = createToken(user._id)

        res.status(200).json({email, token, id:user._id, isVerified: user.isVerified})
        
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

//update a user with host info
const updateUser = async (req, res) => {
    req.params = req.user._id

    let {hobby, allergy, language, adults,children,pet, cuisine,bio, image } = req.body

    try{
        let imageData = {}
    
        if(!mongoose.Types.ObjectId.isValid(req.params)) {
            return res.status(404).json({error: 'No such user'})
        }

        let user = await User.findOne(
            {_id: req.params}
        )

        if(user.form.find(item => item.role === 'host')){
            return res.status(400).json({error: 'You can only fill this form once'})
        } 
        else{

             if (image) {
            const results = await uploadToCloudinary(image, 'family_users')
            imageData = results
            console.log(imageData)
            }
            
            user = await User.findOneAndUpdate(
                {_id: req.params},
                {
                    $push: {
                        form: {
                            role: 'host',
                            hobby,
                            allergy,
                            language,
                            adults,
                            children,
                            pet,
                            cuisine,
                            bio,
                            image: imageData
                        }
                    }
                }
            )
        }

        if(!user){
            return res.status(400).json({error: 'User not found'})
        }

        //console.log(req.params);
        res.status(200).json(user)

    }catch(e){
        console.log(e)
        res.status(500).json({error: 'A server errr occurred with this request. Please wait and try again'})
    }
}

//get a user
const getUser = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid user id'})
    }

    const user = await User.findById(id)

    if(!user){
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
    //console.log(user.email)

}

//get hosts
const getHosts = async (req, res) => {
    const user_id = req.user._id
    
    const hosts = await User.find({_id: {$ne:user_id}}).sort({createdAt: -1})

    res.status(200).json(hosts)
}

//verify email
const verifyEmail = async (req, res) => {
    try{
        const {emailToken} = req.body

        if(!emailToken){
            return res.status(404).json("emailToken not found")
        }

        const user = await User.findOne({emailToken})

        if(user){
            if(user?.isVerified) {
                return res.status(400).json("Email already verified")
            }

            user.emailToken = null
            user.isVerified = true

            await user.save()

            const token = createToken(user._id)

            return res.status(200).json({
                token,
                isVerified: user.isVerified,
            })
        } else{
            res.status(404).json("Email verification failed, invalid token")
        }
    } catch(error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}



module.exports = {
    signupUser,
    loginUser,
    updateUser,
    getUser,
    getHosts,
    verifyEmail
}