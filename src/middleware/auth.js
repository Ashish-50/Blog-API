const jwt = require("jsonwebtoken");
const { getSession } = require("../services/cacheService");

class AuthMiddleware {
  constructor(jwtSecret) {
    this.jwtSecret = jwtSecret || process.env.JWT_SECRET;
  }

  authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ error: "Access denied" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Token missing" });
      }

      const session = await getSession(token);
      if (!session) {
        return res
          .status(401)
          .json({ error: "Invalid session or session expired" });
      }

      const decoded = jwt.verify(token, this.jwtSecret);

      req.userId = decoded.userId;
      req.user = session;
      req.token = token;

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = new AuthMiddleware();
