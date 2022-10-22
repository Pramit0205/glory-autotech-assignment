const { find } = require("../model/attendanceModel");
const attendanceModel = require("../model/attendanceModel");
const employModel = require("../model/employModel")
const vfy = require("../utils/validation")
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose=require('mongoose')




const attendence = async function (req, res) {
    try {
        let data = req.body;
        // request bodu validation
        if (vfy.isEmptyObject(data)) return res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide  details for attendence" })

        let { date, attendence ,isDelete} = data;
        let employId=attendence.employId
        let entryTime=attendence.entryTime
        let exitTime=attendence.exitTime
        // isDelete validation 
        if(isDelete === true) return res.status(404).send({ status: false, Message: "you can't do isDelete is true " })

        //  date valiadation 
        if (vfy.isEmptyVar(date)) return res.status(404).send({ status: false, Message: "pleasee privide the date to take attendence" })
        if (!vfy.isValiddate(date)) return res.status(404).send({ status: false, Message: "it's not a valid date format, date should be in (YYYY-MM-DD) this format" })

        // employId  validation 
        if (vfy.isEmptyVar(employId)) return res.status(400).send({ status: false, message: "employId is required" });
        if (!vfy.isValidObjectId(employId)) return res.status(400).send({ status: false, message: "Not a valid employ id" })

        // check employ is regester on not by employ id
        var id = mongoose.Types.ObjectId(employId);
        let checkEmploy=await employModel.findById(id)
        if(!checkEmploy) return res.status(404).send({status:false,Message:"this employ id is not register , please register first"})

        // entry time 
        if (vfy.isEmptyVar(entryTime)) return res.status(400).send({ status: false, message: "entryTime is required" });
        if (!vfy.isValidString(entryTime)) return res.status(400).send({ status: false, message: "entryTime is not in a valid string formet " });

        // exit time validation 
        if (vfy.isEmptyVar(exitTime)) return res.status(400).send({ status: false, message: "exitTime is required" });
        if (!vfy.isValidString(exitTime)) return res.status(400).send({ status: false, message: "exitTime is not in a valid string formet " });

        let findDate = await attendanceModel.findOne({ date: date })
       
        
        // if date is present so we have to update the employ attendence  else create new document for this date 
        if (findDate) {
            let i = 0
            while (i < findDate.attendence.length) {
                if (findDate.attendence[i].employId == employId) {
                    return res.status(404).send({ status: false, Message: "you already take attendence of this employ" })
                }
                i++
            }
            let obj = {}
            obj.employId = employId;
            obj.entryTime = entryTime;
            obj.exitTime = exitTime;

            let up = await attendanceModel.findOneAndUpdate({ employId }, { "$push": { 'attendence': obj } }, { new: true })
            return res.status(200).send({ status: false.valueOf, Message: "attendence updeate", data: up })
        }
        else{
            
            let createAttendance = await attendanceModel.create(data)
            return res.status(201).send({ status: false, Message: "attendence create for today", data: createAttendance })
        }
       

    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}

const getAttendence= async function(req,res){
    try{
        let date= req.params.date;
        
        // date validation
        if (vfy.isEmptyVar(date)) return res.status(404).send({ status: false, Message: "pleasee privide the date to take attendence" })
        if (!vfy.isValiddate(date)) return res.status(404).send({ status: false, Message: "it's not a valid date format, date should be in (YYYY-MM-DD) this format" })

            let attendenceDetails=await attendanceModel.findOne({date:date,isDelete:false}).select({_id:0,createdAt:0,updatedAt:0,__v:0,isDelete:0})
            if(!attendenceDetails) return res.status(404).send({status:false,Message:"this day's attendence is not available "})
           res.status(200).send({status:false,Message:"attendence details",data:attendenceDetails})


    }
    catch(error){
        res.status(500).send({status:false,error:error.message})
    }
}
module.exports = { attendence , getAttendence }




