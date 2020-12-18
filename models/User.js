const mongoose= require('mongoose');
const bcrypt=require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
    },
    role: {
        type:String,
        enum: ['user','publisher'],
        default: 'user'
    },
    password: {
        type:String,
        required: [true, 'Please add a password'],
        minlength:[6,'Password must be at least 6 characters'],
        select:false
    },
    resetPasswordToken: {
        type:String,
    },
    resetPasswordexpire:{
        Date
    },
    createdAt: {
        type:Date,
        default: Date.now
    }
});

//encrypt password
UserSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
module.exports = mongoose.model('User',UserSchema);