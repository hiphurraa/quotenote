import { 
  createStore, 
  applyMiddleware, 
  compose, 
  combineReducers 
} from "redux";
import thunk from "redux-thunk";

// Reducers
import authenticationState from 'common/state/authenticationState';
import mobileMenuState from 'common/state/mobileMenuState';
import createQuoteState from 'pages/CreateQuote/state/createQuoteState';
import quoteCarouselState from 'pages/Homepage/state/quoteCarouselState';
import quotesListState from 'pages/Homepage/state/quotesListState';
import userQuotesState from 'pages/UserProfile/state/userQuotesState';
import registerUserState from 'pages/RegisterUser/state/registerUserState';
import quotePageState from 'pages/QuotePage/state/quotePageState';
import dialogBoxState from 'common/state/dialogBoxState';
import searchBarState from 'common/state/searchBarState';
import editQuoteState from 'pages/EditQuote/state/editQuoteState';


const initialState = {};
const middleware = [thunk];

const rootReducer = combineReducers({
  authenticationState,
  mobileMenuState,
  createQuoteState,
  quoteCarouselState,
  quotesListState,
  userQuotesState,
  registerUserState,
  quotePageState,
  dialogBoxState,
  searchBarState,
  editQuoteState
});

const store = createStore(
  rootReducer,
  initialState,
  // compose(
  //   applyMiddleware(...middleware),
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
  compose(
    applyMiddleware(...middleware)
  )
);

export default store;