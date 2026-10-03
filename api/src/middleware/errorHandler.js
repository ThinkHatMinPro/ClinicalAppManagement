const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message;

  // Malformed JSON body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  // Prisma known errors
  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with these details already exists";
  } else if (err.code === "P2003") {
    statusCode = 409;
    message = "This record is linked to other records and cannot be changed";
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  // Never expose internal details for server errors
  if (statusCode >= 500) {
    statusCode = 500;
    message = "Internal server error";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;