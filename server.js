const express=require('express')
const dotenv=require('dotenv')
const morgan=require('morgan')
const colors=require('colors') 
const connectDB=require('./config/db')
const errorHandler=require('./middleware/error')
const path=require('path'); 
const fileupload=require('express-fileupload')
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const xss = require('xss-clean')
const hpp=require('hpp')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");
// Load env file
dotenv.config({path:'./config/config.env'})

// Rate limit object
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100
  });
   
connectDB()   
//Variables
const app=express()
const PORT=process.env.PORT || 5000;

//Route Files
const bootcamps=require('./routes/bootcamps')
const courses=require('./routes/courses')
const auth=require('./routes/auth')
const users=require('./routes/users')
const reviews=require('./routes/reviews')

//Middleware 
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
} 
app.use(cors())
app.use(mongoSanitize());
app.use(helmet());
app.use(xss())
app.use(fileupload())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(limiter);
app.use(hpp())
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews);


app.use(errorHandler)

//Wild Card Route
app.all('*',(req,res)=>{
    res.status(404).send({ 
        success:false,
        msg:"This path doesn't exist"
    });
});

const server=app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`.yellow.bold
    );
});

//Promise Rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(err.message.red)
    server.close(()=>process.exit(1))    
})