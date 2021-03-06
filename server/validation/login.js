import Validator from 'validator';
import isEmpty from 'is-empty';

export const validateLoginInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";


    //Validation of incoming fields
    if(isEmpty(data.email)){
        errors.email = "Email field is required";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};