export const notFound = (req, res, next) => {
  const error = new Error (`Not found: ${req.originalURl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ==  200? 500  : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack,
    stauts: statusCode,
    success: false
  })
};