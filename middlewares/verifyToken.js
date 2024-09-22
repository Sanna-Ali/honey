const jwt = require("jsonwebtoken");

// Token überprüfen
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Ungültiges Token, Zugriff verweigert" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Kein Token angegeben, Zugriff verweigert" });
  }
}

// Token und Admin überprüfen
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Nur für Admins zugelassen" });
    }
  });
}

// Token und nur der Benutzer selbst überprüfen
function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Nur für den Benutzer selbst zugelassen" });
    }
  });
}

// Token und Berechtigung überprüfen
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: "Nur für den Benutzer selbst oder Admins zugelassen",
      });
    }
  });
}



function handleToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next()

    } catch (error) {
      return res
        .status(401)
        .json({ message: "Ungültiges Token, Zugriff verweigert" });
    }
  } else {
    next()
  }
}

module.exports = {
  verifyToken,
  handleToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
};
