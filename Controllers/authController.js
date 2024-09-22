const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/**-----------------------------------------------
 * @desc    Register New User
 * @route   /api/auth/register
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "Benutzer existiert bereits" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
  });
  await user.save();

  // Creating new VerificationToken & save it toDB
  const verifictionToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verifictionToken.save();

  // Making the link
  const link = `${process.env.CLIENT_DOMAIN}/api/auth/${user._id}/verify/${verifictionToken.token}`;

  // Putting the link into an html template
  const htmlTemplate = `
    <div>
      <p>Klicken Sie auf den untenstehenden Link, um Ihre E-Mail-Adresse zu verifizieren</p>
      <a href="${link}">Überprüfen</a>
    </div>`;

  // Sending email to the user
  await sendEmail(
    user.email,
    "Verifizieren Sie Ihre E-Mail-Adresse",
    htmlTemplate
  );

  // Response to the client
  res.status(201).json({
    message:
      "Wir haben Ihnen eine E-Mail gesendet, bitte verifizieren Sie Ihre E-Mail-Adresse",
  });
});

/**-----------------------------------------------
 * @desc    Login User
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  console.log(typeof(req.body.email))
  if (error) {
    console.log(error.details[0].message)
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Ungültige E-Mail-Adresse oder ungültiges Passwort" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res
      .status(400)
      .json({ message: "Ungültige E-Mail-Adresse oder ungültiges Passwort" });
  }

  if (!user.isAccountVerified) {
    let verificationToken = await VerificationToken.findOne({
      userId: user._id,
    });

    if (!verificationToken) {
      verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verificationToken.save();
    }

    const link = `${process.env.CLIENT_DOMAIN}/api/auth/${user._id}/verify/${verificationToken.token}`;

    const htmlTemplate = `
    <div>
      <p>Klicken Sie auf den untenstehenden Link, um Ihre E-Mail-Adresse zu verifizieren</p>
      <a href="${link}">Verify</a>
    </div>`;

    await sendEmail(
      user.email,
      "Verifizieren Sie Ihre E-Mail-Adresse",
      htmlTemplate
    );

    return res.status(400).json({
      message:
        "Wir haben Ihnen eine E-Mail gesendet, bitte verifizieren Sie Ihre E-Mail-Adresse",
    });
  }

  const token = user.generateAuthToken();
  const refreshToken = user.generaterefreshToken();
  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
     secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
    refreshToken
  });
  console.log(res)
});

/**-----------------------------------------------
 * @desc    Verify User Account
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Ungültiger Link." });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verificationToken) {
    return res.status(400).json({ message: "Ungültiger Link." });
  }

  user.isAccountVerified = true;
  await user.save();
  await verificationToken.deleteOne();

  res.status(200).json({
    message:
      "Ihr Konto wurde erfolgreich verifiziert. Bitte melden Sie sich an.",
  });
});

/**-----------------------------------------------
 * @desc    Refresh
 * @route   /api/auth/refresh
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.refresh = asyncHandler((req, res) => {
  const authRefresh = req.headers.authorization;
  if (!authRefresh) {
    return res.status(401).json({ message: "Unberechtigt" });
  }
    const refreshToken = authRefresh.split(" ")[1];
 // const cookies = req.cookies;
 // console.log(cookies, 1);
  // if (!cookies?.jwt)
  //const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.JWT_SECRET_REF, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Verboten" });
    console.log(decoded._id);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unberechtigt" });
    const accessToken = user.generateAuthToken();

    res.json({ accessToken });
  });
});
/**-----------------------------------------------
 * @desc    Logout
 * @route   /api/auth/logout
 * @method  POST
 * @access  public
 ------------------------------------------------*/
module.exports.logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie gelöscht" });
};
