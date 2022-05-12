import isEmpty from "is-empty";
import Validator from "validator";
import Quote from "../models/quotesModel.js";
import Comment from "../models/commentModel.js";

//Currently just checking if provided quoteId exists, nut more checks can be added here
export const validateQuoteLike = async (quoteId, userId) => {
    let errors = {};

    //Check if quote exists
    const exists = await Quote.getByQuoteId(quoteId);
    if(!exists)
        errors.quoteId = "Quote with specified id not found";

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

export const validateCommentLike = async (commentId, userId) => {
    let errors = {};

    //Check if quote exists
    const exists = await Comment.getByCommentId(commentId);
    if(!exists)
        errors.quoteId = "Comment with specified id not found";

    return {
        errors,
        isValid: isEmpty(errors)
    };
};