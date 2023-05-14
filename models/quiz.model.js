const mongoose=require("mongoose")

const quizSchema=mongoose.Schema({
    question:String,
    options:[String],
    rightAnswer:Number,
    startDate:Date,
    endDate:Date,
    status: {
        type: String,
        enum: ['inactive', 'active', 'finished'],
        default: 'inactive'
      }
})

const quizModel=mongoose.model("Quiz",quizSchema)

module.exports={
    quizModel
}

