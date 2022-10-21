const express = require('express');
const {createEmploy}=require("../controller/EmployController");
const {firstDay,updateAttendence,getEmployDetails}=require("../controller/attendenceController")

const router = express.Router();

//api's 
router.post('/register',createEmploy );

router.post('/firstDay',firstDay)

router.put("/updateAttendence/:employId",updateAttendence)

router.get('/getEmployDetails/:date',getEmployDetails)
// router.post('/attendance/:employId',attendance)
// router.put('/repeateAttendence/:employId',repeateAttendence)
// router.put('/updateEmploy/:employId',updateEmploy)


module.exports = router