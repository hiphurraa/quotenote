import isEmpty from "is-empty";
import Validator from "validator";

export const validateQuoteData = (data) => {
    let errors = {};

    data.quotetext = !isEmpty(data.quotetext) ? data.quotetext : "";
    data.when = !isEmpty(data.when) ? data.when : "";
    data.when_string = !isEmpty(data.when_string) ? data.when_string : "";
    data.said_by = !isEmpty(data.said_by) ? data.said_by : "";
    data.location = !isEmpty(data.location) ? data.location : "";
    data.user_id = !isEmpty(data.user_id) ? data.user_id : "";


    //Validation of incoming fields
    if (Validator.isEmpty(data.quotetext)){
        errors.quotetext = "The quote cannot be empty!";
    }

    if(!Validator.isLength(data.quotetext, {min: 1, max: 800})){
        errors.quotetext = "The quote must be 1-800 characters!";
    }

    if(!Validator.isISO8601(data.when)){
        data.when = "";
    }

    if(!Validator.isLength(data.when_string, {min:0, max:100})){
        errors.when_string = "The 'when'-description must be 0-100 characters!";
    }

    if(!Validator.isLength(data.said_by, {min:1, max:50})){
        errors.said_by = "Name must be 1-50 characters!";
    }

    if(!Validator.isLength(data.location, {min:0, max: 50})){
        errors.location = "The location must be 0-50 characters!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};