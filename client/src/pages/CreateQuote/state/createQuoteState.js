/* Action types */
const LOADING = "CreateQuote/LOADING";
const ERRORS = "CreateQuote/ERRORS";
const PREVIOUSLY_CREATED = "CreateQuote/PREVIOUSLY_CREATED";

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

const setPreviouslyCreatedQuote = (quote) => {
    return {
      type: PREVIOUSLY_CREATED,
      payload: quote
    };
};

// Export actions
export const createQuoteActions = {
    setIsLoading,
    setErrors,
    setPreviouslyCreatedQuote
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
        case PREVIOUSLY_CREATED:
            return {
                isLoading: false,
                errors: {},
                previouslyCreatedQuote: action.payload
            }
      default:
            return state;
    }
};

export default reducer;

