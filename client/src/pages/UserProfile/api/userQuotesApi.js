import { userQuotesActions } from 'pages/UserProfile/state/userQuotesState';
import axios from "axios";
import { URL } from 'utils/rest_api.json';



// Fetch quotes made by the user
export const getUserQuotes = (dispatch, user_id) => {

  dispatch(userQuotesActions.setIsLoading(true));

  axios
  .get(URL+"/quotes/user/" + user_id)
  .then(res => {
    dispatch(userQuotesActions.setQuotes(res.data.data));
  })
  .catch(err => {
    if (err.response && err.response.data){
      console.log(err.response);
      dispatch(userQuotesActions.setErrors(err.response.data));
    }
    else {
      dispatch(userQuotesActions.setErrors({"error": "Server connection error!"}));
    }
  });
};