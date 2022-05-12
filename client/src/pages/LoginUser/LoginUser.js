// Modules
import { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { loginUser } from 'common/api/loginUserApi';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, MobileMenu, SideNav } from 'common/components';

// Styles
import './styles/LoginUser.css';
import 'common/styles/sidenav-grid.css';
import 'common/styles/form-styles.css';

export default function LoginUser () {

    const history = useHistory();

    //Component state:
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Redux state:
    const dispatch = useDispatch();
    const authState = useSelector(state => state.authenticationState);
    const errorMessage = authState.errors[Object.keys(authState.errors)[0]];


    const handleSubmit = (e) => {
        e.preventDefault();
        const loginData = { email, password };
        loginUser(loginData, history, dispatch);
    }

    if (!authState.isAuthenticated){
        return (
            <div>
                <Navbar/>
                <MobileMenu/>
                <div className='sidenav-grid'>
                    <SideNav/>
                    <div className='page-content'>{/*page-content begins*/}

                        <div className='login-user'>

                                <form className='custom-form' onSubmit={handleSubmit}>

                                    <h3 className='form-title'>Log in</h3>

                                    <fieldset className='form-field'><legend>Email</legend>
                                        <input  autoFocus 
                                                type='text' 
                                                value={email} 
                                                placeholder='Enter email' 
                                                onChange={e => setEmail(e.target.value)}/>
                                    </fieldset>

                                    <fieldset className='form-field'><legend>Password</legend>
                                        <input  type='password' 
                                                value={password} 
                                                placeholder='Enter password' 
                                                onChange={e => setPassword(e.target.value)}/>
                                    </fieldset>

                                    <div className='form-field'>
                                        <p className='error-message'>{errorMessage}</p>
                                        {authState.isLoading? <p>Loading...</p> : ''}
                                    </div>

                                    <div className='form-field'>
                                        <input className='submit-button' type='submit' value='Log in'/>
                                    </div>

                                    <div className='form-field'>
                                        <p>Don't have an account? <Link to='/register'>Register</Link></p>
                                    </div>

                                </form>

                        </div>            

                    </div>{/*page-content ends*/}
                </div>
            </div>
        );
    }
    else {
        return(
            <Redirect to="/profile"/>
        );
    }
};