const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateEmail,
  validateNewPassword,
  validateChangedPassword
} = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


/**-----------------------------------------------
 * @desc    Send Reset Password Link
 * @route   /api/password/reset-password-link
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.sendResetPasswordLinkCtrl = asyncHandler(async (req,res) => {
   // 1. Validation
   const { error } = validateEmail(req.body);
   if(error) {
    return res.status(400).json({ message: error.details[0].message });
   }

   // 2. Get the user from DB by email
   const user = await User.findOne({ email: req.body.email });
   if(!user) {
    return res.status(404).json({ message: "Benutzer mit der angegebenen E-Mail-Adresse existiert nicht" });
   }

   // 3. Creating VerificationToken
   let verificationToken = await VerificationToken.findOne({ userId: user._id });
   if(!verificationToken) {
    verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    });
    await verificationToken.save();
   }

   // 4. Creating link
   const link = `${process.env.CLIENT_DOMAIN}/api/password/reset-password/${user._id}/${verificationToken.token}`;
   // 5. Creating HMTL template
   const htmlTemplate = `<a href="${link}">Klicken Sie hier, um Ihr Passwort zurückzusetzen</a>`;
   // 6. Sending Email
   console.log(link)
  await sendEmail(user.email,"Reset Password",htmlTemplate);
   // 7. Response to the client
   res.status(200).json({
    message: "Passwort-Reset-Link wurde an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie Ihren Posteingang"
   })
});

/**-----------------------------------------------
 * @desc    Get Reset Password Link
 * @route   /api/password/reset-password/:userId/:token
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.userId);
    if(!user) {
        return res.status(400).json({ message: "ungültiger Link" });
    }

    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if(!verificationToken) {
        return res.status(400).json({ success: false, message: "ungültiger Link" });
    }
    
    res.status(200).json({ success: true, message: "gültige URL" });
});

/**-----------------------------------------------
 * @desc    Reset Password
 * @route   /api/password/reset-password/:userId/:token
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.resetPasswordCtrl = asyncHandler(async (req,res) => {
   const { error } = validateNewPassword(req.body);
   if(error) {
    return res.status(400).json({ message: error.details[0].message });
   }

   const user = await User.findById(req.params.userId);
   if(!user) {
    return res.status(400).json({ message: "ungültiger Link" });
   }

   const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
   });
   if(!verificationToken) {
    return res.status(400).json({ message: "ungültiger Link" });
   }

   if(!user.isAccountVerified) {
    user.isAccountVerified = true;
   }

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.password, salt);

   user.password = hashedPassword;
   await user.save();
   await verificationToken.deleteOne();

   res.status(200).json({ message: "Passwort erfolgreich zurückgesetzt, bitte anmelden" });
});


//////////////////////////////////
/**-----------------------------------------------
 * @desc    Change User Password
 * @route   /api/password/change-password
 * @method  POST
 * @access  privte
 ------------------------------------------------*/ 
 module.exports.changePasswordCtrl = asyncHandler(async (req,res) => {  
    const { error } =   validateChangedPassword(req.body);
    if(error) {
       return res.status(400).json({ message: error.details[0].message });
      }
      
     let user = await User.findById(req.user.id)
     if (!user) {
       return res.status(404).json({ message: "Benutzer nicht gefunden" });
     }
     const newPassword = req.body.newPassword;
     const confirmPassword = req.body.confirmPassword;
    
     const isPasswordMatch = await bcrypt.compare(
       req.body.oldPassword ,
       user.password
     );
     if (!isPasswordMatch) {
       return res
         .status(400)
         .json({ message: "Ungültige E-Mail-Adresse oder ungültiges Passwort" });
     }
     if (newPassword !== confirmPassword) {
       return res.status(400).json({ message: 'Das neue Passwort stimmt nicht überein!' });
     }
     
     const salt = await bcrypt.genSalt(10);
     password = await bcrypt.hash(req.body.newPassword, salt);
     user.password = password
     await user.save();
     return res.status(200).json({ message: 'Das Passwort wurde erfolgreich geändert!' });
    })