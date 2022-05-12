import isEmpty from "is-empty";
import Validator from "validator";

export const validateRegisterInput = (data) => {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    

    //Validation of incoming fields
    if (Validator.isEmpty(data.name)){
        errors.name = "Name field is required!";
    }

    if (Validator.isEmpty(data.email)){
        errors.email = "Email field is required!";
    } else if(!Validator.isEmail(data.email)){
        errors.email = "Email field is invalid!";
    }

    if (Validator.isEmpty(data.password)){
        errors.password = "Password field is required!";
    }

    if (Validator.isEmpty(data.password2)){
        errors.password2 = "Password confirmation field is required!";
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.passwordLength = "Password must be atleast 6 characters";
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.passwordMatch = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};