// middleware.js
const jwt = require("jsonwebtoken");

// ⚠️ MÊME CLÉ POUR SIGNER ET POUR VÉRIFIER
const SECRET_KEY = "Dxi90UGj2SINEgbTi99c1mlufLm1a00z"; 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  // Debug pour vérifier dans les logs Node du terminal backend :
  console.log("Token reçu dans le middleware :", token);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Erreur de vérification JWT :", err.message); // 👈 Utile pour debug dans ton terminal !
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
};

module.exports = {
  authenticateToken,
  generateToken,
  SECRET_KEY,
};