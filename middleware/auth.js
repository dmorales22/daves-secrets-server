const jwt = require("jsonwebtoken");
const config = process.env;

/**
 * This function handles the token validation for the protected routes.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const verifyJWTToken = (req, res, next) => {
  const token = req.headers["x-access-token"]; // Gets token from headers

  if (!token) {
    // Returns 403 error if token is not found
    return res.status(403).send("A token is required for authentication");
  }
  try {
    req.agent = jwt.verify(token, config.TOKEN_KEY); // Verifies toke
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

/**
 * This function handles the token validation for the protected routes.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const verifySession = (req, res, next) => {
  // Add the names of the session keys you want to check here
  const requiredKeys = ["agent_id", "agent_secret_key", "organization_id"];

  // Check if the session object exists
  if (!req.session) {
    return res.status(401).json({ result: false, msg: "Session not found." });
  }

  // Check if each required key is present in the session object
  for (const key of requiredKeys) {
    if (!(key in req.session)) {
      return res
        .status(401)
        .json({ result: false, msg: "Session is not valid." });
    }
  }

  return next();
};

module.exports = { verifySession, verifyJWTToken };
