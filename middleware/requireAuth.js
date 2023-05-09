const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    //verify authentication

    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'})
    }

    //split header by a space to get the token which is the second part
    const token = authorization.split(' ')[1]

    //check that the string has not been tampered with and attach it to the user request
    try{
        const {_id} = jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({_id}).select('_id')
        next()
    }catch(error){
        console.log(error)
        res.status(401).json({error: 'Request not authorised'})
    }
}

module.exports = requireAuth