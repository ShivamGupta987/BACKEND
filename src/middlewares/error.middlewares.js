const errorMiddleware = (err,req,res,next) =>{

    err.statusCode = err.statuscode || 500;
    err.message = err.message || 'something went wrong';



    return res.status(err.statusCode).json({
        success:false,
        message : err.message,
        stack : err.stack
    })
}

export default errorMiddleware