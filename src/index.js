const express = require("express");
const app = express();
const mongoose = require("mongoose");
const route = require("./route/route.js")
const bodyParser=require("body-parser")
const multer = require("multer");

const upload = multer();

app.use(upload.any());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://urajrishu:aUHDB96UyJaq9SB@cluster0.1wief.mongodb.net/pramit",
    { useNewUrlParser: true })
    .then(() => console.log("let's go, MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(3000, function () {
    console.log('Ok, Express app running on port ' + (3000))
});

