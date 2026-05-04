const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    resumeText:{
        type:String,
        required:true   
    },
    analysisResult:{
        type:Object,
        default:null
    },
    matchResult:{
        type:Object,
        default:null
    },
    jobDescription:{
        type:String,
        default:null
    }
}, { timestamps: true }
)

const resumeModel = mongoose.model("Resume", resumeSchema)
module.exports = resumeModel