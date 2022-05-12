/* Action types */
const LOADING = "EditQuote/LOADING";
const ERRORS = "EditQuote/ERRORS";

/* Actions */

const setIsLoading = (isLoading) => {
    return {
        type: LOADING,
        payload: isLoading,
    };
};

const setErrors = (errors) => {
    return {
        type: ERRORS,
        payload: errors
    };
};

// Export actions
export const editQuoteActions = {
    setIsLoading,
    setErrors
};





/* Reducer */

const initialState = {
    previouslyCreatedQuote: null,
    isLoading: false,
    errors: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isLoading: action.payload,
                errors: {}
            };
        case ERRORS:
            return {
                ...state,
                isLoading: false,
                errors: action.payload
            };
      default:
            return state;
    }
};

export default reducer;

