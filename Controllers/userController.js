const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser, validateEmail } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/**-----------------------------------------------
 * @desc    Get All Users Profile
 * @route   /api/users
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**-----------------------------------------------
 * @desc    Get User Profile
 * @route   /api/users/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getUser = asyncHandler(async (req, res) => {
  // 1. Get the user from DB
  const user = await User.findById(req.params.id).select("-password");

  // 2. Check if user exists
  if (!user) {
    return res.status(404).json({ message: "Benutzer nicht gefunden" });
  }

  // 3. Send the user to the client
  res.status(200).json(user);
});

/**-----------------------------------------------
 * @desc    Update User Profile
 * @route   /api/users/:id
 * @method  PUT
 * @access  private (only user himself)
 ------------------------------------------------*/
module.exports.updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");

  res.status(200).json(updatedUser);
});

// /**-----------------------------------------------
//  * @desc    Get Users Count
//  * @route   /api/users/count
//  * @method  GET
//  * @access  private (only admin)
//  ------------------------------------------------*/
// module.exports.getUsersCount = asyncHandler(async (req, res) => {
//   const count = await User.count();
//   res.status(200).json({count});
// });

/**-----------------------------------------------
 * @desc    Delete User Profile (Account)
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 ------------------------------------------------*/
module.exports.deleteUser = asyncHandler(async (req, res) => {
  // 1. Get the user from DB
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Benutzer nicht gefunden" });
  }

  // 2. Delete the user
  await User.findByIdAndDelete(req.params.id);

  // 3. Send a response to the client
  res.status(200).json({ message: "Ihr Profil wurde gelöscht" });
});

/**-----------------------------------------------
 * @desc    Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  if (!req.files.length) {
    return res.status(400).json({ message: "kein Bild bereitgestellt" });
  }
  // 2. Get the path to the image
  const imagePath = path.join(process.env.SERVER_DOMAIN,`/images/${req.files[0].filename}`);
  // 3. Get the user from DB
  const user = await User.findById(req.user.id);
  if(!user){
    fs.unlink(
      path.join(__dirname, `../images/${req.files[0].filename}`),
      (error) => {
        console.log(error);
      }
    );
    return res.status(404).json({message: "user not found"})
  }
  // 4. get old url
  const oldUrl = user.profilePhoto.url;
  // 5. Change the profilePhoto field in the DB
  user.profilePhoto = {
    url: imagePath,
  };
  await user.save();
  if (oldUrl) {
    try {
      const image = fs.readFileSync(oldUrl);
      if (image) fs.unlinkSync(oldUrl);
    } catch (error) {}
  }
  // 7. Send response to client
  res.status(200).json({
    message: "Ihr Profilfoto wurde erfolgreich hochgeladen",
    profilePhoto: { url: imagePath },
  });
});

/**-----------------------------------------------
 * @desc    update email
 * @route   /api/users/update-email/userId
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
module.exports.updateEmail = asyncHandler(async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user1 = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user1) {
    return res.status(400).json({ message: "Email schon registriert" });
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json({ message: "Benutzer nicht gefunden" });
  }
  let obj = {
    userId: user._id,
    newEmail: req.body.email.toLowerCase(),
  };
  success = myCache.set(`${user._id}`, obj, 300);
  console.log(success);
  // // Creating new VerificationToken & save it toDB
  const verifictionToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verifictionToken.save();
  // Making the link
  const link = `${process.env.CLIENT_DOMAIN}/api/users/updateEmail/${user._id}/verify/${verifictionToken.token}`;
  // Putting the link into an html template
  const htmlTemplate = `
    <div>
      <p>Klicken Sie auf den Link unten, um Ihre E-Mail-Adresse zu bestätigen</p>
      <a href="${link}">Verify</a>
    </div>`;

  // Sending email to the user
  await sendEmail(req.body.email, "Bestätigen Sie Ihre E-Mail", htmlTemplate);
  await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        isAccountVerified: false,
      },
    },
    { new: true }
  );
  // Response to the client
  res.status(201).json({
    message:
      "Wir haben Ihnen eine E-Mail gesendet. Bitte bestätigen Sie Ihre E-Mail-Adresse",
  });
});

/**-----------------------------------------------
 * @desc    verify new Email 
 * @route   /api/auth/updateEmail/:userId/verify/:token
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.verifyNewEmailUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Ungültiger Link" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verificationToken) {
    return res.status(400).json({ message: "Ungültiger Link" });
  }

  value = myCache.get(`${user._id}`);
  if (value == undefined) {
    return res.status(400).json({ message: "Bitte versuche es erneut" });
  } else {
    console.log(value);
    user.email = value.newEmail;
    user.isAccountVerified = true;
    await user.save();
  }

  await verificationToken.deleteOne();

  res.status(200).json({
    message:
      "Ihre E-Mail-Adresse wurde erfolgreich aktualisiert und verifiziert. Bitte melden Sie sich an",
  });
});

/**-----------------------------------------------
* @desc    get location information 
* @route   /api/user/info/userid
* @method  Get
* @access   private (user himself)
------------------------------------------------*/
module.exports.getLocationInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Benutzer nicht gefunden" });
  }
  const locInfo = {
    cityname: user.cityname,
    username: user.username,
    citynumber: user.citynumber,
    streetnumber: user.streetnumber,
    homenumber: user.homenumber,
  };
  res.status(200).json(locInfo);
});