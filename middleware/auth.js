exports.requireRole = (role) => (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: "Not logged in" });
  if (req.session.user.Role !== role) return res.status(403).json({ message: "Access denied" });
  next();
};
