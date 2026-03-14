const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({

    type:String,

    difficulty:String,

    topic:String,

    questionText:String,

    userAnswer:String,

    language:String,

    score:Number,

    feedback:String,

    timeTaken:Number

})

const cheatingSchema = new mongoose.Schema({

    event:String,

    timestamp:Date

})

const interviewSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    role:String,

    experienceLevel:String,

    startTime:{
        type:Date,
        default:Date.now
    },

    endTime:Date,

    status:{
        type:String,
        default:"running"
    },

    questions:[questionSchema],

    cheatingEvents:[cheatingSchema],

    finalReport:{
        overallScore:Number,
        codingScore:Number,
        conceptScore:Number,
        strengths:[String],
        weaknesses:[String]
    }

})

module.exports = mongoose.model("Interview", interviewSchema)