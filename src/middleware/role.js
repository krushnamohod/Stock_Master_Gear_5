export const requireManager = (req, res, next) => {
  try {
    if (req.user?.role !== "MANAGER") {
      return res.status(403).json({ message: "Access denied — MANAGER only." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
