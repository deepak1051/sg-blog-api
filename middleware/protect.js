const protect = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(400).json({ message: 'not authorized, login please' });
  }
};

export { protect };
