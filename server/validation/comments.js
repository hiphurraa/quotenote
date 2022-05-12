import isEmpty from "is-empty";
import Validator from "validator";

export const validateCommentData = (data) => {
    let errors = {};

    data.comment = !isEmpty(data.comment) ? data.comment : "";
    //Validate required fields
    if(isEmpty(data.quoteId)){
        errors.quoteId = "You need to provide quoteId which the comment is related to"
    }

    if(Validator.isEmpty(data.comment)){
        errors.comment = "You can't post an empty comment";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}