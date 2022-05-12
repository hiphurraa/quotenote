import axios from "axios";
import { authenticationActions } from 'common/state/authenticationState';
import setAuthToken from "utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { URL } from 'utils/rest_api.json';


// Login user - get access token
export const loginUser = (loginData, history, dispatch) => {

  dispatch(authenticationActions.setIsLoading(true));

  axios
    .post(URL+"/users/login", loginData)
    .then(res => {
        const { accessToken, roles } = res.data;
        var user = jwt_decode(accessToken);
        user.roles = roles;
        dispatch(authenticationActions.setCurrentUser(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userRoles", roles);
        setAuthToken(accessToken);
        history.push("/");
    })
    .catch(err => {
      if (err.response && err.response.data){
        dispatch(authenticationActions.setErrors(err.response.data));
      }
      else {
        dispatch(authenticationActions.setErrors({error: "Server connection error!"}));
      }
    });
};

// Log user out
export const logoutUser = (dispatch, history) => {
    localStorage.removeItem("accessToken");
    setAuthToken(false);
    dispatch(authenticationActions.setCurrentUser({}));
    history.push("/");
};