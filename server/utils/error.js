


class BaseError extends Error {
    constructor(message,statusCode){
          super(message);
          this.statusCode = statusCode;
          this.isOperational = true;

          Error.captureStackTrace(this, this.constructor);
    }
}



const errorHandler = (err, req, res, next) =>{
    let { message, statusCode } = err;
    

    if(!message) message = "Internal Server Error";
    if(!statusCode) statusCode = 500

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "dev" && {stack: err.stack})
    })
}




module.exports =  { BaseError, errorHandler};

