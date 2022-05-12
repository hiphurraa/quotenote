
/* Action types */
const OPEN = 'SearchBar/OPEN';
const CLOSE = 'SearchBar/CLOSE';
const TOGGLE = 'SearchBar/TOGGLE';



/* Actions */

const open = () => {
    return {
        type: OPEN
    };
};

const close = () => {
    return {
        type: CLOSE
    };
};

const toggle = () => {
    return{
        type: TOGGLE
    };
}

// Export actions
export const searchBarActions = {
    open,
    close,
    toggle
};




/* Reducer */

const initialState = {
    show: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN:
            return {
                show: true
            };
        case CLOSE:
            return{
                show: false
            }
        case TOGGLE:
            return{
                show: !state.show
            }
        default:
            return state;
    };
};

export default reducer;