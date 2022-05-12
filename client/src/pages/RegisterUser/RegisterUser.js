// Modules
import { useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { registerUser } from './api/registerUserApi';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, MobileMenu, SideNav } from 'common/components';

// Styles
import './styles/RegisterUser.css';
import 'common/styles/form-styles.css';
import 'common/styles/sidenav-grid.css';

export default function RegisterUser () {

    const history = useHistory();

    // Component state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    // Redux state
    const dispatch = useDispatch();
    const registerState = useSelector(state => state.registerUserState);
    const authState = useSelector(state => state.authenticationState);
    const errorMessage = registerState.errors[Object.keys(registerState.errors)[0]];

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { name, email, password, password2 };
        registerUser(userData, history, dispatch);
    };




    if (!authState.isAuthenticated){
        return (
            <div>
                <Navbar/>
                <MobileMenu/>
                <div className='sidenav-grid'>
                    <SideNav/>
                    <div className='page-content'>{/*page-content begins*/}

                        <div className='register-user'>

                                <form className='custom-form' onSubmit={handleSubmit}>

                                    <h3 className='form-title'>Register</h3>

                                    <fieldset className='form-field'><legend>Username</legend>
                                        <input  type='text' 
                                                placeholder='Choose a username' 
                                                value={name} 
                                                onChange={e => setName(e.target.value)}/>
                                    </fieldset>

                                    <fieldset className='form-field'><legend>Email</legend>
                                        <input  type='text' 
                                                placeholder='Enter your email' 
                                                value={email} 
                                                onChange={e => setEmail(e.target.value)}/>
                                    </fieldset>

                                    <fieldset className='form-field'><legend>Password</legend>
                                        <input  type='password' 
                                                placeholder='Choose a strong password' 
                                                value={password} 
                                                onChange={e => setPassword(e.target.value)}/>
                                    </fieldset>

                                    <fieldset className='form-field'><legend>Confirm password</legend>
                                        <input  type='password' 
                                                placeholder='Confirm your password' 
                                                value={password2} 
                                                onChange={e => setPassword2(e.target.value)}/>
                                    </fieldset>

                                    <div className='form-field'>
                                        <p className='error-message'>{errorMessage}</p>
                                        {registerState.isLoading? <p>Loading...</p> : ''}
                                    </div>

                                    <div className='form-field'>
                                        <input className='submit-button' type='submit' value='Register'/>
                                    </div>

                                    <div className='form-field'>
                                        <p>Already have an account? <Link to='login'>Log in</Link></p>
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
            <Redirect to="/" />
        );
    }
}