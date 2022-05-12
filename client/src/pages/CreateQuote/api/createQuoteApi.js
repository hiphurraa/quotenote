import axios from "axios";
import { createQuoteActions } from 'pages/CreateQuote/state/createQuoteState';
import { URL } from 'utils/rest_api.json';

// create a new quote
export const createQuote = (data, history, dispatch) => {

    dispatch(createQuoteActions.setIsLoading(true));

    axios
      .post(URL+"/quotes/", {data})
      .then(res => {
            dispatch(createQuoteActions.setPreviouslyCreatedQuote(res));
            const id = res.data.id;
            // Redirect the user to the quote that was created
            history.push("quote/" + id);
        })
      .catch(err => {
        if (err.response && err.response.data){
            dispatch(createQuoteActions.setErrors(err.response.data));
          }
          else {
            dispatch(createQuoteActions.setErrors({error: "Server connection error!"}));
          }
      });

};