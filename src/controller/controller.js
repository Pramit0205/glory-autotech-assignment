const employModel = require('../model/employModel')
const vfy = require('../utils/validation')
const { uploadFile } = require('../utils/awsUpload')
const { response } = require('express')



const createEmploy = async function (req, res) {
    try {
        const requestBody = req.body

        if (vfy.isEmptyObject(requestBody)) return res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide employ details" })

        let { name, email, phone, dob, salary, experience, joiningDate, address } = requestBody
        const files = req.files

        if (vfy.isEmptyFile(files)) return res.status(400).send({ status: false, Message: "Please provide employ's document picture" })
        // name validation
        if (vfy.isEmptyVar(name)) return res.status(400).send({ status: false, Message: "Please provide employ's name" })
        if (vfy.isValidString(name)) return res.status(404).send({ status: false, Message: "name is not in his valid format" })

        // email validation 
        if (vfy.isEmptyVar(email)) return res.status(400).send({ status: false, Message: "Please provide employ's email" })
        if (!vfy.isValidEmail(email)) return res.status(400).send({ status: false, Message: "please provide valid email" });

        // phone validation
        if (vfy.isEmptyVar(phone)) return res.status(400).send({ status: false, Message: "Please provide phone number" })
        if (!vfy.isValidPhone(phone)) return res.status(400).send({ status: false, Message: "please provide valid phone number" });

        // date if birth validation
        if (!dob) return res.status(400).send({ status: false, Message: "dob is required" });
        if (vfy.isEmptyVar(dob)) return res.status(400).send({ status: false, Message: "dob is required and should not be an empty string" });
        if (!vfy.isValiddate(dob)) return res.status(400).send({ status: false, Message: "Enter a valid dob" });

        // experience validation 
        if (experience) {
            if (vfy.isEmptyVar(experience)) return res.status(400).send({ status: false, Message: "please fill the experience field" });
            if (isNaN(experience)) return res.status(404).send({ status: false, Message: "expreience take only numbers" })
        }
        // joining date
        if (joiningDate) {
            if (!vfy.isValiddate(joiningDate)) return res.status(404).send({ status: false, Message: "it's not a valid date format" })
        }

        // salary validation 
        if (!salary) return res.status(404).send({ status: false, Message: "salary is required" })
        if (isNaN(salary)) return res.status(400).send({ status: false, Message: "Please provide a valid  salary" })


        if (vfy.isEmptyVar(address)) return res.status(400).send({ status: false, Message: "Please provide address" })
        const addressObject = vfy.isValidJSONstr(address)
        if (!addressObject) return res.status(400).send({ status: false, Message: "Address json you are providing is not in a valid format 🤦‍♂😂🤣" })


        let { present, parmanent } = addressObject
        // present address validation
        if (vfy.isEmptyObject(present)) return res.status(400).send({ status: false, Message: "Please provide present address" })
        if (vfy.isEmptyVar(present.street)) return res.status(400).send({ status: false, Message: "Plz provide present street..!!" });
        if (vfy.isEmptyVar(present.city)) return res.status(400).send({ status: false, Message: "Plz provide present city..!!" });
        if (!present.pincode || isNaN(present.pincode)) return res.status(400).send({ status: false, Message: "Plz provide shopping pincode" });
        if (!vfy.isValidPincode(present.pincode)) return res.status(400).send({ status: false, Message: "Plz provide a valid pincode" });

        // billinf address validation
        if (vfy.isEmptyObject(parmanent)) return res.status(400).send({ status: false, Message: "Plz provide parmanent address.!!" });
        if (vfy.isEmptyVar(parmanent.street)) return res.status(400).send({ status: false, Message: "Plz provide parmanent street..!!" });
        if (vfy.isEmptyVar(parmanent.city)) return res.status(400).send({ status: false, Message: "Plz provide parmanent city..!!" });
        if (!parmanent.pincode || isNaN(parmanent.pincode)) return res.status(400).send({ status: false, Message: "Plz provide parmanent pincode" });
        if (!vfy.isValidPincode(parmanent.pincode)) return res.status(400).send({ status: false, Message: "Plz provide a valid pincode" });

        //=================================Unique Db calls (Time saving)===============================================================>>

        let usedEmail = await employModel.findOne({ email });
        if (usedEmail) return res.status(400).send({ status: false, Message: "This email is already registerd" });

        let usedMobileNumber = await employModel.findOne({ phone });
        if (usedMobileNumber) return res.status(400).send({ status: false, Message: "This Mobile no. is already registerd" });

        // ================================= qws file upload here 📷📷🖼 ==========================>>
        if (!vfy.acceptFileType(files[0], 'image/jpeg', 'image/png')) return res.status(400).send({ status: false, Message: "we accept jpg, jpeg or png as profile picture only" });

        const profilePicture = await uploadFile(files[0])


        const employrequestBody = { name, email, phone, documents: profilePicture, salary, dob, experience, joiningDate, address: addressObject }
        // create employ ✅
        const newemploy = await employModel.create(employrequestBody);

        res.status(201).send({ status: true, message: `employ registered successfully`, data: newemploy });

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, Message: error.message })
    }
}




const updateEmploy = async function (req, res) {
    try {
        let employId = req.params.employId
        let data = req.body
        // employ id validation 
        if (vfy.isEmptyFile(employId)) return res.status(400).send({ status: false, Message: "Please provide employ's id" })
        if (!vfy.isValidObjectId(employId)) return res.status(404).send({ status: false, Message: "please enter a valid employ id" })

        // check employ is present or notin our database
        let employ = await employModel.findById(employId)
        if (!employ || employ.isDelete == true) return res.status(404).send({ status: false, Message: "this employ is not regester or deleted" })

        let { date, time } = data;

        //    date validation 
        if (vfy.isEmptyVar(date)) return res.status(404).send({ status: false, Message: "plese enter the date" })
        if (!vfy.isValiddate(date)) return response.status(404).send({ status: false, Message: "please enter a valid date" })

        // time validation 
        if (vfy.isEmptyVar(time)) return res.status(404).send({ status: false, Message: "please enter the time" })
        const timeObj = vfy.isValidJSONstr(time)
        let add = {}
        add.date = date
        add.time = timeObj


        employ['attendance'].push(add)

        let updateEmploy = await employModel.findOneAndUpdate(
            { _id: employId },
            employ,
            { new: true }
        )
        res.status(200).send({ status: true, message: "employ profile updated", data: updateEmploy });

    }
    catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}





const getEmployDetails = async function (req, res) {
    try {
        // // let date=req..date;
        // // date validation
        // // if (vfy.isEmptyVar(date)) return res.status(404).send({ status: false, Message: "plese enter the date" })
        // // if (!vfy.isValiddate(date)) return response.status(404).send({ status: false, Message: "please enter a valid date" })

        // let employ= await employModel['attendance'].find( {date:req.query.date} )

        // res.status(200).send({satatus:true,data:employ})


    }
    catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}


module.exports = { createEmploy}


