const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "segredo_temporario");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

module.exports = authMiddleware;
