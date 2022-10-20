const mongoose = require("mongoose")
const ObjectId = require("mongoose").Types.ObjectId;

const attendanceSechema = new mongoose.Schema({
    employId: { type: ObjectId, ref: 'employ', required: true, trim: true },
    
    // time: [{
    //     date: { type: String,trim:true},
    //     entryTime: { type: String, trim: true,default:"10 am"},
    //     exitTime: { type: String, trime: true ,default:"6 pm"}
    // }],
    attendance:{
        date:{
            type:[String]
            
        },
        entryTime:{
            type:[String],
            
        },
        exitTime:{
            type:[String],
           
            
        }
    }
    
}, { timestamps: true })


module.exports = mongoose.model("attendence", attendanceSechema)