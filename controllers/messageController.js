const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

//fetch messages for a particular chat
const fetchMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chat_id })
      .populate("sender", "first_name last_name")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//send a message
const sendMessage = async (req, res) => {
  const { chat_id, content } = req.body;

  if (!chat_id || !content) {
    return res.status(400).json({ error: "Chat id and message required" });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chat_id,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "first_name last_name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "first_name last_name email",
    });

    await Chat.findByIdAndUpdate(req.body.chat_id, { latestMessage: message });

    res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = { sendMessage, fetchMessages };
