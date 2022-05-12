import axios from "axios";
import { editQuoteActions } from '../state/editQuoteState';
import { URL } from 'utils/rest_api.json';

// Edit an existing quote
export const updateQuote = (id, quote, history, dispatch) => {

    dispatch(editQuoteActions.setIsLoading(true));

    axios
      .put(URL+"/quotes/"+id, {quote})
      .then(res => {
            // Redirect the user to the quote that was created
            history.push("/quote/" + id);
        })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.data){
            dispatch(editQuoteActions.setErrors(err.response.data));
          }
          else {
            dispatch(editQuoteActions.setErrors({error: "Server connection error!"}));
          }
      });

};