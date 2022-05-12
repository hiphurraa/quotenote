/* Action types */
const SET_QUOTES = "userQuotes/SET_QUOTES";
const LOADING = "userQuotes/LOADING";
const ERRORS = "userQuotes/ERRORS";


/* Actions */

const setQuotes = (quotes) => {
    return{
        type: SET_QUOTES,
        payload: quotes
    };
};

const setIsLoading = (isLoading) => {
    return{
        type: LOADING,
        payload: isLoading
    };
};

const setErrors = (errors) => {
    return {
        type : ERRORS,
        payload: errors
    }
};

// Export actions
export const userQuotesActions = {
    setQuotes,
    setIsLoading,
    setErrors
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
                isloading: action.payload,
                errors: false
              };
        case ERRORS:
            return{
                ...state,
                isLoading: false,
                errors: action.payload
            };
        default:
          return state;
      }
}

export default reducer;

