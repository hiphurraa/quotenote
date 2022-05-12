import isEmpty from 'is-empty';

/* Action types */
const SET_CURRENT_USER = 'authentication/SET_CURRENT_USER';
const LOADING = 'authentication/LOADING';
const ERRORS = 'authentication/ERRORS';





/* Actions */

const setCurrentUser = (userData) => {
    return {
      type: SET_CURRENT_USER,
      payload: userData
    };
};

const setIsLoading = (isLoading) => {
  return {
    type: LOADING,
    payload: isLoading
  };
}

const setErrors = (errors) => {
  return {
    type: ERRORS,
    payload: errors
  }
}

// Export actions
export const authenticationActions = {
  setCurrentUser,
  setIsLoading,
  setErrors
}





/* Reducer */

const initialState = {
  isAuthenticated: false,
  user: {},
  isLoading: false,
  errors: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
            isAuthenticated: !isEmpty(action.payload),
            user: action.payload,
            errors: {}
        };
      case LOADING:
        return {
          ...state,
          errors: {},
          isLoading: true
        }
      case ERRORS:
        return {
          ...state,
          isLoading: false,
          errors: action.payload
        }
      default:
        return state;
    }
};

export default reducer;