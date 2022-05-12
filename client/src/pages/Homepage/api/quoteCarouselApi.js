import axios from "axios";
import { quoteCarouselActions } from 'pages/Homepage/state/quoteCarouselState';
import { URL } from 'utils/rest_api.json';

// get for the carousel
export const getQuotes = (dispatch) => {
  
    dispatch(quoteCarouselActions.setIsLoading(true));

    axios
    .get(URL+"/quotes/carousel")
    .then(res => {
      dispatch(quoteCarouselActions.setQuotes(res.data.data));
    })
    .catch(err => {
      if (err.response && err.response.data){
        dispatch(quoteCarouselActions.setErrors(err.response.data));
      }
      else {
        dispatch(quoteCarouselActions.setErrors({"error": "Server connection error!"}));
      }
    });
};