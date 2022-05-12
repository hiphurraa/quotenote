
/* Action types */
const APPEAR = 'dialogbox/APPEAR';
const RESET = 'dialogbox/RESET';



/* Actions */

const appear = (dialogType, message, callBackFunction, parameter) => {
  return {
    type: APPEAR,
    dialogType,
    message,
    callBackFunction,
    parameter
  }
}

const reset = () => {
    return {
        type: RESET,
    }
}

// Export actions
export const dialogActions = {
    appear,
    reset
}





/* Reducer */

const initialState = {
    dialogType: "question",
    message: "",
    callBackFunction: null,
    parameter: false,
    show: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case APPEAR:
            if(action.parameter)
                return {
                    dialogType: action.dialogType,
                    message: action.message,
                    callBackFunction: action.callBackFunction,
                    parameter: action.parameter,
                    show: true
                };
            else
                return {
                    dialogType: action.dialogType,
                    message: action.message,
                    callBackFunction: action.callBackFunction,
                    parameter: false,
                    show: true
                };
        case RESET:
            return{
                ...initialState
            }
      default:
        return state;
    }
};

export default reducer;