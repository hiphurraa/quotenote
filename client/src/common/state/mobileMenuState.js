
/* Action types */
const TOGGLE = 'mobileMenu/TOGGLE';



/* Actions */

const toggle = () => {
    return {
        type: TOGGLE
    };
};

// Export actions
export const mobileMenuActions = {
    toggle
};




/* Reducer */

const initialState = {
    show: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case TOGGLE:
        return {
            show: !state.show
        };
      default:
        return state;
    };
};

export default reducer;