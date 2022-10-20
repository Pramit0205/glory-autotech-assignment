const attendanceModel = require("../model/attendanceModel");
// const { findByIdAndUpdate } = require("../model/employModel");
const employModel = require("../model/employModel")
const vfy = require("../utils/validation")
const ObjectId = require("mongoose").Types.ObjectId;

// const creatAttendance = async function(req,res){
//     try{
//         let data=req.body
//         let employId=req.params.employId
//         console.log(employId)

//         if (vfy.isEmptyObject(data)) return res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide  details for attendence" })

// // employ id validation
//         if (vfy.isEmptyVar(employId)) return res.status(400).send({ status: false, message: "employId is required" });
//         if (!vfy.isValidObjectId(employId)) return res.status(400).send({ status: false, message: "Not a valid employ id" });
       
//         let findEmploy = await employModel.findById(employId)
//         if (!findEmploy) return res.status(404).send({ status: false, Message: "This id not in our database . Please register first" })

//         let {date,time}=obj;
        
//         const creatAttendance= await attendanceModel.create(obj)
//         res.status(201).send({status:true,data:creatAttendance}) 
//     }
//     catch (error) {
//         res.status(500).send({ status: false, Error: error.message })
//      }
// }

// module.exports={creatAttendance}























const firstDay = async function (req, res) {
    try {
        const requestBody = req.body

        if (vfy.isEmptyObject(requestBody)) return res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide  details for attendence" })
        let { employId,time } = requestBody

        // employ id validation
        if (vfy.isEmptyVar(employId)) return res.status(400).send({ status: false, message: "employId is required" });
        if (!vfy.isValidObjectId(employId)) return res.status(400).send({ status: false, message: "Not a valid employ id" });
        let findEmploy = await employModel.findById(employId)
        if (!findEmploy) return res.status(404).send({ status: false, Message: "This id not in our database . Please register first" })
        let obj = {}
        
        obj.date=new Date().toISOString().split('T')[0]
       obj.entryTime=time.entryTime
       obj.exitTime=time.exitTime


        requestBody["time"] = obj
        console.log(requestBody)
        let createAttendance = await attendanceModel.create(requestBody)
        res.status(201).send({ status: true, Message: "checkIn time is created", data: createAttendance })


    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }

}


const updateAttendence= async function(req,res){
    try{
        let employId=req.params.employId;
        let data=req.body
        let findAttendence=await attendanceModel.findOne({employId})
        console.log(findAttendence)
    }
    catch(error){
        res.status(500).send({ status: false, Error: error.message })
    }
}


const attendance=async function(req,res){
    try{
        let employId=req.params.employId
        let data =req.body
        let {date,entryTime,exitTime}=data;
        let findEmploy=await attendanceModel.findOne({employId})
        if(findEmploy == null){
            let data2={
                employId:employId,
                attendance:{
                    date:[date],
                    entryTime:[entryTime],
                    exitTime:[]
                }
            }
            console.log("yes4")
            const employ1=await attendanceModel.create(data2)
            res.send({employ1})
        }
        
        else{
            let data5={
                employId:employId,
                attendance:{
                    date:findEmploy.attendance.date,
                    entryTime:findEmploy.attendance.entryTime,
                    exitTime:findEmploy.attendance.exitTime.push(exitTime)
                }
            }
            console.log("yes")
            let findEmploy2=await attendanceModel.findOneAndUpdate({employId:employId},{data5},{new:true})
            res.send(findEmploy2)
        }
        if(findEmploy.attendance.date.indexOf(date)==-1){
            let data3={
                employId:employId,
                attendance:{
                    date:findEmploy.attendance.date.push(date),
                    entryTime:findEmploy.attendance.entryTime.push(entryTime),
                    exitTime:findEmploy.attendance.exitTime
                }
            }
            console.log("yes2")
            const employ2=await attendanceModel.findOneAndUpdate({employId:employId},{data3},{new:true})
            res.send(employ2)
        }
        else{
            let data4={
                employId:employId,
                attendance:{
                    date:findEmploy.attendance.date,
                    entryTime:findEmploy.attendance.entryTime,
                    exitTime:findEmploy.attendance.exitTime.push(exitTime)
                }
            }
            console.log("yes3")
            const employ3=await attendanceModel.findOneAndUpdate({employId:employId},{data4},{new:true})
            res.send(employ3)
        }

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}


// const repeateAttendence=async function(req,res){
//     try{
//         let employId=req.params.employId
//         let data=req.body
//         const find=await attendanceModel.findOne({employId})
        
//         let repeate= await attendanceModel.findOneAndUpdate({employId},{$set:data},{new:true})
//         res.send(repeate)

//     }
//     catch (error) {
//         res.status(500).send({ status: false, Error: error.message })
//     }
// }



module.exports = { firstDay ,updateAttendence,attendance}





