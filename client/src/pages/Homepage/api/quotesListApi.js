import axios from "axios";
import { quotesListActions } from 'pages/Homepage/state/quotesListState';
import { URL } from 'utils/rest_api.json';

// get quotes for the quotes list
export const getQuotes = (dispatch) => {
  
    dispatch(quotesListActions.setIsLoading(true));

    axios
    .get(URL+"/quotes/recent")
    .then(res => {
      dispatch(quotesListActions.setQuotes(res.data.data));
    })
    .catch(err => {
      if (err.response && err.response.data){
        dispatch(quotesListActions.setErrors(err.response.data));
      }
      else {
        dispatch(quotesListActions.setErrors({"error": "Server connection error!"}));
      }
    });
};