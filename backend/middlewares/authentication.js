const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookievalue = req.cookies[cookieName];
    if (!tokenCookievalue)
      return res.status(404).json({ msg: "User must be Login" });

    try {
      const userPayload = validateToken(tokenCookievalue);
      req.user = userPayload;
      return next();
    } catch (error) {
      console.error("Error in JWT Verification", error);
      return res
        .clearCookie("token")
        .status(401)
        .json({ msg: "Please Login Again" });
    }
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
