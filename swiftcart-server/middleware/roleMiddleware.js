const roleMiddleware = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied for user with role: ${req.user.role}`);
      return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
    }
    next();
  };
};

module.exports = roleMiddleware;
