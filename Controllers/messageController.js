
const asyncHandler = require("express-async-handler");
const { Message, validateaddmessage, validateaddreply } = require("../models/message");
const { User } = require('../models/User');
const { Notification } = require("../models/Notification");
 /*-----------------------------------------------
* @desc Add message
* @route /api/message/add
* @method POST
* @access  private (only user)
------------------------------------------------*/
module.exports.addmessage = asyncHandler(async (req, res) => {
  const { error } = validateaddmessage(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({_id: req.user.id})
  if(!user){
    return res.status(404).json({message: "user not found"})
  }
  let email = user.email
  const message = new Message({
    userId: req.user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: email,
    subject: req.body.subject,
    to: "admin",
    message: req.body.message,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toISOString().split("T")[1].split(".")[0].substring(0, 5)

  })
  await message.save();
  const notification = new Notification({
    title: "New Message",
    message: `You have A New Message from ${user.firstname} ${user.lastname}`,
    to: "admin",
    content: {messageId : message._id.toString()},
    kind: 'm'
  })
  await notification.save()
  console.log(notification)
  res.status(200).json(message);
});


/*-----------------------------------------------
* @desc    get message
* @route   /api/message/:id
* @method  GET
* @access   private (only admin or user himself)
------------------------------------------------*/
module.exports.getmessage = asyncHandler(async (req, res) => {
  let message
  if(req.user.isAdmin){
    message = await Message.findById(req.params.id);
  } else {
    message = await Message.findOne({_id: req.params.id, userId: req.user.id})
  }
  if (!message) {
    return res.status(404).json({ message: "message not found" });
  }
  message.thestatus = "read";
  await message.save()
  res.status(200).json(message);
});
/*-----------------------------------------------
* @desc    get messages
* @route   /api/message/
* @method  GET
* @access   private (only admin)
------------------------------------------------*/
module.exports.getmessagesForAdmin = asyncHandler(async (req, res) => {
  if(req.query){
     keyword = req.query.keyword
  }
  let umessages
  if(keyword == 'sent'){
     umessages = await Message.find({to: {$ne :"admin"}})
  }
  else if(keyword == 'rec'){
     umessages = await Message.find({to: "admin"})    
  }else if(keyword == 'unread'){
     umessages = await Message.find({to: "admin", thestatus: "unread"});
  } 
  else {
     umessages = await Message.find();
  }
  if(!umessages.length){
    return res.status(404).json({message: "NO Messages found"})
  }
  res.status(200).json(umessages);
});
/*-----------------------------------------------
* @desc    get messages
* @route   /api/message/
* @method  GET
* @access   private (user)
------------------------------------------------*/
module.exports.getmessagesForUser = asyncHandler(async (req, res) => {
  if(req.query){
    keyword = req.query.keyword
  }
  let user = await User.findOne({_id: req.user.id})
  if(!user){
    return res.status(404).json({message: "User Not Found"})
  }
  let email = user.email
  let umessages
  if(keyword == 'sent'){
     umessages = await Message.find({email: email})
  }
  else if(keyword == 'rec'){
     umessages = await Message.find({to: email})    
  }else if(keyword == 'unread'){
     umessages = await Message.find({to: email, thestatus: "unread"});
  } 
  else {
     umessages = await Message.find({$or: [{email:email}, {to: email}]});

  }
  if(!umessages.length){
    return res.status(404).json({message: "NO Messages found"})
  }
  res.status(200).json(umessages);
});

/*-----------------------------------------------
* @desc    get message
* @route   /api/message/re
* @method  POST
* @access   private (only admin)
------------------------------------------------*/
module.exports.addreply = asyncHandler(async (req, res) => {
  const { error } = validateaddreply(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({email: req.body.to})
  if(!user){
    return res.status(404).json({message: "user not dound"})
  }
  const reply = new Message({ 
    to: req.body.to.toLowerCase(), 
    message: req.body.message ,
    subject:req.body.subject ,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toISOString().split("T")[1].split(".")[0].substring(0, 5)
  });
  await reply.save()

  const notification = new Notification({
    title: "New Message",
    message: `You have A New Message`,
    to: user._id,
    content: {messageId : reply._id.toString()}
  })
  await notification.save()
  res.status(200).json(reply);
});

/*-----------------------------------------------
* @desc    delete message
* @route   /api/message/:id
* @method  delete
* @access   private
------------------------------------------------*/
module.exports.deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res
      .status(404)
      .json({ message: "Message not found" });
  }
  if(!req.user.isAdmin && message.to != "admin"){
    return res.status(401).json({message: "you are not alloewd to delete replies of admin"})
  }
  await Message.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json({ message: "message deleted successfully" });
});
