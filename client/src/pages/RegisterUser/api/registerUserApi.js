import axios from "axios";
import { registerUserActions } from 'pages/RegisterUser/state/registerUserState';
import { URL } from 'utils/rest_api.json';
import { dialogActions } from 'common/state/dialogBoxState';

// Register User
export const registerUser = (userData, history, dispatch) => {

    dispatch(registerUserActions.setIsLoading(true));

    axios
      .post(URL+"/users/register", userData)
      .then(res => {
            // Redirect user to login page and inform the user of confirmation email
            history.push("/login")
            const message = "User registered succesfully! Please confirm your email by clicking the link we have sent to you.";
            dispatch(dialogActions.appear("inform", message, ()=>{}));
        })
        .catch(err => {
            if (err.response && err.response.data){
                dispatch(registerUserActions.setErrors(err.response.data));

            }
            else {
                dispatch(registerUserActions.setErrors({error: "Server connection error!"}));
            }
          });
  };