const express = require('express');
const {createEmploy}=require("../controller/EmployController");

const {attendence,getAttendence}=require('../controller/attendenceController')

const router = express.Router();

//api's 
router.post('/register',createEmploy );

router.post('/takeAttendence',attendence)

router.get('/getAttendence/:date',getAttendence)


module.exports = router