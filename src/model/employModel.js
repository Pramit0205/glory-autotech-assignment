const mongoose = require("mongoose");


const employSchema = new mongoose.Schema({
    name: { type: String, require: true, trim: true },
    email: { type: String, require: true, unique: true, trim: true },
    phone: { type: Number, required: true, unique: true, trim: true, },
    dob: { type: String, require: true, trim: true },//date formet:- DD/MM/YYYY
    experience: { type: String, trim: true, default: "0" },
    joiningDate: { type: String, trim: true, default: new Date() },//date formet:- DD/MM/YYYY
    documents: { type: String, required: true, trim: true, },// to upload id proof
    salary: { type: Number, require: true, trim: true },

    address: {
        present: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: Number, required: true }
        },

        parmanent: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: Number, required: true }
        }
    },
    isDelete: { type: Boolean, default: false }
}, { timestamps: true })


module.exports = mongoose.model("employ", employSchema);