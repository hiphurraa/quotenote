// Modules
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import { Navbar, MobileMenu, SideNav } from 'common/components';
import { logoutUser } from 'common/api/loginUserApi';
import UserQuotes from './UserQuotes';
import { dialogActions } from 'common/state/dialogBoxState';

// Styles
import './styles/UserProfile.css';
import 'common/styles/sidenav-grid.css';


export default function UserProfile () {

    //Redux state:
    const dispatch = useDispatch();
    const authState = useSelector(state => state.authenticationState);

    const history = useHistory();

    const logout = () => {
        logoutUser(dispatch, history);
    }

    const deleteUserProfile = () => {
        history.push("/account/delete");
    }

    const confirmUserDelete = () => {
        const message = "WARNING! Are you sure you want to delete your account? This will be irreversible and you will not be able to get your account back."
        setTimeout(() => { dispatch(dialogActions.appear("confirm-delete", message, deleteUserProfile)); }, 500);
    }

    if (authState.isAuthenticated){

        return (
            <div>
                <Navbar/>
                <MobileMenu/>
                <div className='sidenav-grid'>
                    <SideNav/>
                    <div className='page-content'>{/*page-content begins*/}
                        
                        <div className='user-profile'>

                            <div className='profile-card'>

                                <h3>User profile</h3>

                                <table>
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>username: </td>
                                            <td>{authState.user.name}
                                            
                                            {(authState.user.roles && authState.user.roles.includes("admin"))? 
                                            <span className='admin-tag'> Admin</span>:''}

                                            {(authState.user.roles && authState.user.roles.includes("moderator"))? 
                                            <span className='moderator-tag'> Moderator</span>:''}</td>

                                        </tr>
                                        <tr>
                                            <td>email:</td>
                                            <td>{authState.user.email}</td>
                                        </tr>
                                        <tr>
                                            <td>created:</td>
                                            <td>{authState.user.created_at.slice(0, 10).replaceAll("-", "/")}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className='user-profile-buttons'>
                                    <button className='logout-button' onClick={logout}>Log out</button>
                                    <button className='delete-user-button' onClick={confirmUserDelete}>Delete account</button>
                                </div>
                                

                            </div>

                            <UserQuotes/>
                    
                        </div>

                    </div>{/*page-content ends*/}
                </div>
            </div>
        );
    }
    else {
        return(
            <Redirect to="/login" />
        );
    }
    
}