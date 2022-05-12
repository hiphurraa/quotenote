// Modules
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import setAuthToken from "./utils/setAuthToken";
import { useDispatch } from 'react-redux';
import { authenticationActions } from 'common/state/authenticationState';
import { logoutUser } from 'common/api/loginUserApi';
import jwt_decode from "jwt-decode";
import EmailConfirmation from 'utils/EmailConfirmation';
import DialogBox from 'common/components/DialogBox';

// Styles
import 'common/styles/page-settings.css';
import './App.css';



// Pages
import Homepage from 'pages/Homepage/Homepage';
import RegisterUser from 'pages/RegisterUser/RegisterUser';
import LoginUser from 'pages/LoginUser/LoginUser';
import UserProfile from 'pages/UserProfile/UserProfile';
import CreateQuote from 'pages/CreateQuote/CreateQuote';
import QuotePage from 'pages/QuotePage/QuotePage';
import FavoritesPage from 'pages/FavoritesPage/FavoritesPage';
import EditQuote from 'pages/EditQuote/EditQuote';
import CategoryPage from 'pages/CategoryPage/CategoryPage';
import DeleteUserConfirmation from 'utils/DeleteUserConfirmation';

export default function App () {

    // Redux state:
    const dispatch = useDispatch();
    const history = useHistory();

    // Check if theres access token every time the page is reloaded
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
        const user = jwt_decode(accessToken);
        setAuthToken(accessToken);
        user.roles = localStorage.getItem("userRoles");
        dispatch(authenticationActions.setCurrentUser(user));
    }
    else {
        logoutUser(dispatch, history);
    }


    return ( 
        <div>
            <DialogBox/>
            <Switch>
                <Route path="/" component={Homepage} exact />
                <Route path="/register" component={RegisterUser} exact />
                <Route path="/login" component={LoginUser} exact />
                <Route path="/profile" component={UserProfile} exact />
                <Route path="/create" component={CreateQuote} exact />
                <Route path="/quote/edit/:id" component={EditQuote} exact />
                <Route path="/quote/:id" component={QuotePage} exact />
                <Route path="/favorites" component={FavoritesPage} exact />
                <Route path="/confirmation/:token" component={EmailConfirmation} exact />
                <Route path="/categories/:category" component={CategoryPage} exact />
                <Route path="/account/delete" component={DeleteUserConfirmation} exact />
            </Switch>
        </div>
    );

}