const express=require('express')
const dotenv=require('dotenv')
const morgan=require('morgan')
const colors=require('colors') 
const connectDB=require('./config/db')
const errorHandler=require('./middleware/error')
// Load env file
dotenv.config({path:'./config/config.env'})


connectDB()   
//Variables
const app=express()
const PORT=process.env.PORT || 5000;

//Route Files
const bootcamps=require('./routes/bootcamps')

//Middleware 
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
} 
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
app.use('/api/v1/bootcamps',bootcamps);
app.use(errorHandler)

//Wild Card Route
app.all('*',(req,res)=>{
    res.send({ 
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