// Modules
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { mobileMenuActions } from '../state/mobileMenuState';
import user_icon from 'common/images/user_icon.svg';

// Styles
import './styles/MobileMenu.css';

export default function MobileMenu () {

    const history = useHistory();
    const dispatch = useDispatch();

    // Redux state:
    const mobileMenuState = useSelector(state => state.mobileMenuState);
    const auth = useSelector(state => state.authenticationState);

    // CSS Classes:
    const classList = mobileMenuState.show? 'mobile-menu menu-show' : 'mobile-menu';

    return (
        <div className={classList}>
            {auth.isAuthenticated?
                <span className='user-link' onClick={e=>{
                    history.push('/profile');
                    dispatch(mobileMenuActions.toggle());
                    }}>
                        <img src={user_icon} alt='user_icon'/>{auth.user.name}
                </span>
            :''}
            <ul>
                <h2 className='menu-title'>Menu</h2>
                    <li onClick={e => {
                            history.push("/");
                            dispatch(mobileMenuActions.toggle());
                        }}>Home</li>

                    {auth.isAuthenticated? 
                    <li onClick={e => {
                        history.push("/create");
                        dispatch(mobileMenuActions.toggle());
                    }}>Create a quote</li>
                    :""}

                    {auth.isAuthenticated?
                    <li onClick={e => {
                        history.push('/favorites');
                        dispatch(mobileMenuActions.toggle());
                    }}>My favorites</li>
                    :""}

                    <li onClick={e => {
                        history.push("/profile");
                        dispatch(mobileMenuActions.toggle());
                    }}>{auth.isAuthenticated? 'My profile' : 'Login'}</li>
            </ul>
        </div>
    );
}