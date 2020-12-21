const mongoose  = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxlength: [100,'Max length is 100 characters']
    },
    text: {
      type: String,
      required: [true, 'Please add some text']
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Please add a Rating between 1 and 10']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bootcamp',
      required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
  });

//One review per user per bootcamp
ReviewSchema.index({bootcamp: 1,user:1},{unique: true})

ReviewSchema.statics.getAverageRating=async function(bootcampId){
  const obj=await this.aggregate([{
    $match:{bootcamp:bootcampId}
  },
  {
      $group: {
        _id:'$bootcamp',
        averageRating:{$avg:'$rating'}
      }
  }])
  try{
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
      averageRating:obj[0].averageRating
    })
  }catch(err){
    next(err);
  }
}

ReviewSchema.pre('remove', function (){
  this.constructor.getAverageRating(this.bootcamp)
})

// Call getAverageCost after save 
ReviewSchema.post('save', function (){
  this.constructor.getAverageRating(this.bootcamp)
})


module.exports=mongoose.model('Review',ReviewSchema);