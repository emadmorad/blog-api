const errorHandler = function(err, req, res, next) {
    console.log(err.stack);
  
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
  
    res.status(status).json({ message: message });
  };
  
  module.exports = errorHandler;