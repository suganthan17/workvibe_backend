exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user)
      return res.status(401).json({ message: "Unauthorized" });

    if (req.session.user.Role !== role)
      return res.status(403).json({ message: "Forbidden" });

    next();
  };
};
