//this error is object of errorResponse sent by bootcamp.js controller
// this is why it has statusCode and message Properties

const errorResponse = require("../utils/errorResponse");

const errorHandler=(error,req,res,next)=>{
    console.log(error.stack.red);
    err=error.message
    //Wrong ID error
    if(error.name=='CastError'){
        const message=`Bootcamp with id ${error.value} not found`
        err=new errorResponse(message,404)
    } 
    //Duplicate ID error
    if(error.code===11000){
            const message=`Bootcamp with name already exists`
            err=new errorResponse(message,400)
    }

    //Mongoose Validation Error
    if(error.name==='ValidationError'){
        const message=Object.values(error.errors).map(val=>val.message)
        err=new errorResponse(message,400)  
    }
    res.status(err.statusCode || 500).json({
        success:false,
        error:err.message || "Server Error"    
    });
}

module.exports=errorHandler