// middlewares/auth.middleware.js
const { authenticateToken } = require('../services/authToken');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token not sent" });
    }

    // Formato "Bearer <token>" ou token direto
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const user = await authenticateToken(token);
    req.user = user; // anexa o user para uso posterior nas controllers
    next();
  } catch (err) {
    // Lida com mensagens vindas diretamente do authenticateToken
    const errorMessage = err.message || "Internal Error.";
    if (errorMessage === "Token not sent") return res.status(401).json({ message: errorMessage });
    if (errorMessage === "There isn't a session with the Token!") return res.status(403).json({ message: errorMessage });
    if (errorMessage === "Invalid Token!") return res.status(400).json({ message: errorMessage });
    if (errorMessage === "User not found.") return res.status(404).json({ message: errorMessage });

    return res.status(500).json({ message: errorMessage });
  }
};