
/* Action types */
const ERRORS = 'RegisterUser/ERRORS';
const LOADING = 'RegisterUser/LOADING';




/* Actions */

const setErrors = (errors) => {
    return {
        type : ERRORS,
        payload: errors
    }
}

const setIsLoading = (isLoading) => {
    return {
        type: LOADING,
        payload: isLoading
    }
}

// Export actions
export const registerUserActions = {
    setErrors,
    setIsLoading
};





/* Reducer */

const initialState = {
    errors: {},
    isLoading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case ERRORS:
            return{
                errors: action.payload,
                isLoading: false
            };
        case LOADING:
            return {
                errors: {},
                isLoading: true
            }
        default:
          return state;
      }
}

export default reducer;