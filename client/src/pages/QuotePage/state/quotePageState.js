
/* Action types */
const SET_QUOTE = "QuotePage/SET_QUOTE";
const QUOTE_LOADING = "QuotePage/QUOTE_LOADING";
const QUOTE_ERRORS = "QuotePage/QUOTE_ERRORS";
const SET_COMMENTS = "QuotePage/SET_COMMENTS";
const COMMENTS_LOADING = "QuotePage/COMMENTS_LOADING";
const COMMENTS_ERRORS = "QuotePage/COMMENTS_ERRORS";
const IS_POSTING_COMMENT = "QuotePage/IS_POSTING_COMMENT";
const COMMENT_POST_ERRORS = "QuotePage/COMMENT_POST_ERRORS";
const RESET_STATE = "QuotePage/RESET_STATE";





/* Actions */

const setQuote = (quote) => {
    return{
        type: SET_QUOTE,
        payload: quote
    };
}

const setQuoteIsLoading = (isLoading) => {
    return{
        type: QUOTE_LOADING,
        payload: isLoading
    };
}

const setQuoteErrors = (errors) => {
    return {
        type : QUOTE_ERRORS,
        payload: errors
    }
}

const setComments = (comments) => {
    return {
        type: SET_COMMENTS,
        payload: comments
    }
}

const setIsCommentsLoading = (isLoading) => {
    return {
        type: COMMENTS_LOADING,
        payload: isLoading
    }
}

const setCommentsErrors = (errors) => {
    return {
        type: COMMENTS_ERRORS,
        payload: errors
    }
}

const setIsPostingComment = (isPostingComment) => {
    return{
        type: IS_POSTING_COMMENT,
        payload: isPostingComment
    }
} 

const setCommentPostErrors = (errors) => {
    return{
        type: COMMENT_POST_ERRORS,
        payload: errors
    }
}

const resetState = () => {
    return{
        type: RESET_STATE,
        payload: initialState
    };
}

export const quotePageActions = {
    setQuote,
    setQuoteIsLoading,
    setQuoteErrors,
    setComments,
    setIsCommentsLoading,
    setCommentsErrors,
    setIsPostingComment,
    setCommentPostErrors,
    resetState
};





/* Reducer */

const initialState = {
    quote: {},
    isQuoteLoading: true,
    quoteErrors: false,
    comments: {},
    isCommentsLoading: true,
    commentsErrors: false,
    isPostingComment: false,
    commentPostErrors: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_QUOTE:
            return {
                ...state,
                quote: action.payload,
                isQuoteLoading: false,
                quoteErrors: false
            };
        case QUOTE_LOADING:
            return {
                ...state,
                isQuoteLoading: action.payload,
                quoteErrors: false
              };
        case QUOTE_ERRORS:
            return{
                ...state,
                isQuoteLoading: false,
                quoteErrors: action.payload
            };
        case SET_COMMENTS:
            return {
                ...state,
                comments: action.payload,
                isCommentsLoading: false
            }
        case COMMENTS_LOADING:
            return {
                ...state,
                isCommentsLoading: action.payload
            }
        case COMMENTS_ERRORS:
            return {
                ...state,
                commentsErrors: action.payload,
                isCommentsLoading: false
            }
        case IS_POSTING_COMMENT:
            return {
                ...state,
                isPostingComment: action.payload
            }
        case COMMENT_POST_ERRORS:
            return{
                ...state,
                isPostingComment: false,
                commentPostErrors: action.payload

            }
        case RESET_STATE:
            return{
                ...action.payload
            }
        default:
          return state;
      }
}

export default reducer;