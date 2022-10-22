const mongoose = require("mongoose")
const ObjectId = require("mongoose").Types.ObjectId;

const attendanceSechema = new mongoose.Schema({
    date: { type: String, trim: true },

    attendence: [{
        employId: { type: ObjectId, ref: 'employ', required: true, trim: true },
        entryTime: { type: String, trim: true, default: "10 am" },
        exitTime: { type: String, trime: true, default: "6 pm" }
    }],
    isDelete:{type:Boolean,default:false}

}, { timestamps: true })


module.exports = mongoose.model("attendence", attendanceSechema)