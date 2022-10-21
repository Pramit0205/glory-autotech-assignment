const { find } = require("../model/attendanceModel");
const attendanceModel = require("../model/attendanceModel");
const employModel = require("../model/employModel")
const vfy = require("../utils/validation")
const ObjectId = require("mongoose").Types.ObjectId;



const firstDay = async function (req, res) {
    try {
        const requestBody = req.body

        if (vfy.isEmptyObject(requestBody)) return res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide  details for attendence" })
        let { employId, entryTime, exitTime } = requestBody
        let findEmploy1 = await attendanceModel.findOne({ employId })
        if(findEmploy1) return res.status(404).send({status:false,Message:"you already give your attendence"})


        if (!vfy.isEmptyVar(entryTime)) return res.status(400).send({ status: false, message: "entryTime is required" });
        if (!vfy.isEmptyVar(exitTime)) return res.status(400).send({ status: false, message: "exitTime is required" });
        // employ id validation
        if (vfy.isEmptyVar(employId)) return res.status(400).send({ status: false, message: "employId is required" });
        if (!vfy.isValidObjectId(employId)) return res.status(400).send({ status: false, message: "Not a valid employ id" });
        let findEmploy = await employModel.findById(employId)
        if (!findEmploy) return res.status(404).send({ status: false, Message: "This id not in our database . Please register first" })
        let obj = {}

        obj.date = new Date().toISOString().split('T')[0]
        obj.entryTime = entryTime
        obj.exitTime = exitTime
       
        requestBody["time"] = obj
        console.log(requestBody)
        let createAttendance = await attendanceModel.create(requestBody)
        res.status(201).send({ status: true, Message: "checkIn time is created", data: createAttendance })


    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }

}


const updateAttendence = async function (req, res) {
    try {
        let employId = req.params.employId
        let data = req.body
        if (vfy.isEmptyObject(data)) return res.status(400).send({ status: false, Message: "Invalid request , Please provide  details for attendence" })

        //   employ id validation 
        if (vfy.isEmptyVar(employId)) return res.status(400).send({ status: false, message: "employId is required" });
        if (!vfy.isValidObjectId(employId)) return res.status(400).send({ status: false, message: "Not a valid employ id" })

        let findEmploy = await attendanceModel.findOne({ employId })
        if (!findEmploy) return res.status(400).send({ status: false, message: "this employ is not register . please register first" })
        let { entryTime, exitTime } = data
        let obj = {}

        obj.date = new Date().toISOString().split('T')[0]
        let findAttendence = await attendanceModel.find(obj)
         if(findAttendence) return res.status(404).send({status:false,Message:"you already give your attendence"})
        obj.entryTime = entryTime
        obj.exitTime = exitTime


        findEmploy.time.push(obj)

        let up = await attendanceModel.findOneAndUpdate({ employId }, { "$push": { 'time': obj } }, { new: true })


        res.status(201).send({ status: true, Message: "update successfully", data: up })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

const getEmployDetails = async function (req, res) {
    try {
        let data = req.params.date;//date formet :YYYY-MM-DD
        if (vfy.isEmptyObject(data)) return res.status(400).send({ status: false, Message: "Invalid request , Please provide  details for attendence" })
       
     
        let findAttendence = await attendanceModel.findOne({ data }).select({ employId: 1, _id: 0 })
        var arr = [];
        for (let i = 0; i < findAttendence.length; i++) {
            let employ = findAttendence[0].employId

            let findEmploy = await employModel.find({ employ }).select({ name: 1, _id: 1 })
            let findAtt = await attendanceModel.find({ employ }).select({ time: 1, _id: 0 })

            arr.push([findEmploy[i], findAtt[i]])
   }

        res.status(201).send({ status: true, Messege: "employ details", data: arr })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}




module.exports = { firstDay, updateAttendence, getEmployDetails }





