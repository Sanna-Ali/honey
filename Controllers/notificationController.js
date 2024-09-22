const asyncHandler = require("express-async-handler");
const { Notification } = require("../models/Notification");

/**-----------------------------------------------
 * @desc    get Admin Notifications
 * @route   /api/notification/admin
 * @method  GET
 * @access  private (only admin) 
 ------------------------------------------------*/
const getAdminNotifications = asyncHandler( async ( req, res ) => {
    const notifications = await Notification.find({to: "admin", kind: {$ne:"m"}}).sort({createdAt: -1})
    if(!notifications.length){
        return res.status(404).json({message: "Keine Benachrichtigung"})
    }
    await Notification.updateMany({to: "admin"}, {read: true})

    res.status(200).json(notifications)
})

/**-----------------------------------------------
 * @desc    get Admin Notifications
 * @route   /api/notification/message/admin
 * @method  GET
 * @access  private (only admin) 
 ------------------------------------------------*/
 const getAdminNotificationsForMessages = asyncHandler( async ( req, res ) => {
    const notifications = await Notification.find({to: "admin", kind:"m"}).sort({createdAt: -1})
    if(!notifications.length){
        return res.status(404).json({message: "Keine Benachrichtigung"})
    }
    await Notification.updateMany({to: "admin"}, {read: true})

    res.status(200).json(notifications)
})

/**-----------------------------------------------
 * @desc    get User Notifications
 * @route   /api/notification/user/:id (userId)
 * @method  GET
 * @access  private (only user himself) 
 ------------------------------------------------*/
const getUserNotifications = asyncHandler( async ( req, res ) => {
    const notifications = await Notification.find({to: req.params.id}).sort({createdAt: -1})
    if(!notifications.length){
        return res.status(404).json({message: "Keine Benachrichtigung"})
    }
    await Notification.updateMany({to: req.params.id}, {read: true})
    res.status(200).json(notifications)
})

module.exports = {
    getAdminNotifications,
    getUserNotifications,
    getAdminNotificationsForMessages
}