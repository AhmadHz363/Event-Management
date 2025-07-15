const UserRoles = require("../Models/enums/UserRoles");

function authorizeRoles(...roles) {
  const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;

  // Validate the allowedRoles passed into the middleware
  const invalidRoles = allowedRoles.filter((role) => !UserRoles.isValid(role));
  if (invalidRoles.length > 0) {
    throw new Error(
      `Invalid roles passed to authorizeRoles middleware: ${invalidRoles.join(
        ", "
      )}`
    );
  }

  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ error: "Role information missing." });
    }

    if (!UserRoles.isValid(userRole)) {
      return res.status(403).json({ error: "Invalid role on token." });
    }

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions." });
    }

    next();
  };
}

module.exports = authorizeRoles;
