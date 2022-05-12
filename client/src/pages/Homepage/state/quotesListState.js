
/* Action types */
const SET_QUOTES = "QuotesList/SET_QUOTES";
const LOADING = "QuoteList/LOADING";
const ERRORS = "QuoteList/ERRORS";
const RESET_STATE = "QuoteList/RESET_STATE";




/* Actions */
const setQuotes = (quotes) => {
    return{
        type: SET_QUOTES,
        payload: quotes
    };
}

const setIsLoading = (isLoading) => {
    return{
        type: LOADING,
        payload: isLoading
    };
}

const setErrors = (errors) => {
    return {
        type : ERRORS,
        payload: errors
    }
}

const resetState = () => {
    return {
        type: RESET_STATE,
        payload: initialState
    }
}

export const quotesListActions = {
    setQuotes,
    setIsLoading,
    setErrors,
    resetState
};





/* Reducer */

const initialState = {
    quotes: {},
    isLoading: true,
    errors: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_QUOTES:
            return {
                quotes: action.payload,
                isLoading: false,
                errors: false
            };
        case LOADING:
            return {
                ...state,
                isLoading: action.payload,
                errors: false
              };
        case ERRORS:
            return{
                ...state,
                isLoading: false,
                errors: action.payload
            };
        case RESET_STATE:
            return {
                ...action.payload
            }
        default:
          return state;
      }
}

export default reducer;