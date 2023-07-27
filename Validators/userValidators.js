

let isEmpty = require("is-empty");
let validator = require("validator");


module.exports.LoginValidator = (data) => {
    const errors = {};

    data.email = !(isEmpty(data.email)) ? data.email : "";
    data.password = !(isEmpty(data.password)) ? data.password : "";

    let emailError = validator.isEmpty(data.email) ? "Email is required!" : (!validator.isEmail(data.email) ? "Please provide a valid email!": "");
    let passwordError = validator.isEmpty(data.password) ? "Passord is required": "";


    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    return{
        errors,
        isValid: isEmpty(errors)
    }
}


module.exports.RegisterValidator = (data) => {
    const errors = {}

    data.email = !(isEmpty(data.email)) ? data.email : "";
    data.password = !(isEmpty(data.password)) ? data.password : "";
    data.firstName = !(isEmpty(data.firstName)) ? data.firstName : "";
    data.lastName = !(isEmpty(data.lastName)) ? data.lastName : "";

    let emailError = validator.isEmpty(data.email) ? "Email is required!" : (!validator.isEmail(data.email) ? "Please provide a valid email!": "");
    let passwordError = validator.isEmpty(data.password) ? "Passord is required": "";
    let firstNameError = validator.isEmpty(data.firstName) ? "First Name is required": "";
    let lastNameError = validator.isEmpty(data.lastName) ? "Last Name is required": "";

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (firstNameError || lastNameError) errors.firstName = "Full name is required";

    return{
        errors,
        isValid: isEmpty(errors)
    }
}



