const mongoose = require('mongoose');


let isEmptyVar = function (value) {
    if(!value) return true
    if (typeof value === 'undefined' || value === null) return true;
    if (value.trim().length === 0) return true;
    return false;
}

const isValidPhone = (Mobile) => {
    return /^[6-9]\d{9}$/.test(Mobile)
};
const isValidEmail = (Email) => {
    return /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
};

const isValidString = (String) => {
    return /\d/.test(String)
}
    const isValidExperience = (experience) => {
        return /^\d{9}$/.test(experience)
    };
const isValiddate=(date)=>{
    return /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])[\/]\d{4}$/.test(date)
}
const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
  }
  let isValidJSONstr = (json) => {
    try {
        return JSON.parse(json)
    } catch (_) {
        return false
    }
}
let isEmptyObject = function (body) {
    if (!body) return true
    if (Object.keys(body).length == 0) return true;
    return false;
}
const isValidPincode= function (value) {
    return /^[1-9]{1}[0-9]{5}$/.test(value);
}

const acceptFileType = (file, ...types) => {
    return types.indexOf(file.mimetype) !== -1 ? true : false
}
let isEmptyFile = (file) => {
    if (!file || file.length == 0) return true
    return false
}

module.exports = { isEmptyVar,isValidPhone,isValidEmail,isValidString ,isValidExperience,isValiddate,isValidObjectId,isValidJSONstr,isEmptyObject,isValidPincode,acceptFileType,isEmptyFile,}
