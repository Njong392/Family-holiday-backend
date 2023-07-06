const Chat = require('../models/chatModel')
const User = require('../models/userModel')


//access a chat or create a new chat
const accessChat = async(req, res) => {
  const {sender_id} =  req.body 

  if(!sender_id) {
    return res.status(400).json({error: 'Sender id required'})
  }

  var isChat = await Chat.find({
    $and: [
        {users: {$elemMatch: { $eq: req.user._id}}},
        {users: {$elemMatch: { $eq: sender_id}}}
    ]
  }).populate('users','-password').populate('latestMessage')

  isChat = await User.populate(isChat, {path: 'latestMessage.sender', select: 'firstName lastName'})

    if(isChat.length > 0){
        res.send(isChat[0])
    } else{
        var chatData = {
            chatName: 'sender',
            users: [req.user._id, sender_id]
        }

        try{
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({_id: createdChat._id}).populate('users','-password')

            res.status(200).send(fullChat)
            console.log(sender_id)
        } catch(error){
            
            res.status(400).send({error: error.message})
        }
    }
}

//fetch all the chats
const fetchChats = async(req, res) => {
    try{
        Chat.find({users: {$elemMatch: { $eq: req.user._id}}})
        .populate('users','-password')
        .populate('latestMessage')
        .sort({updatedAt: -1}).then(async (results) => {
            results = await User.populate(results, {path: 'latestMessage.sender', select: 'firstName lastName'})

             res.status(200).send(results)
        })     

    } catch(error){
        res.status(500).send({error: error.message})
    }
}

module.exports = { accessChat, fetchChats}