import './styles/SideNav.css';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import sidenav_plus_icon from 'common/images/sidenav_plus_icon.svg';
import sidenav_user_icon from 'common/images/sidenav_user_icon.svg';
import sidenav_favorites_icon from 'common/images/sidenav_favorites_icon.svg';

export default function SideNav () {

    const history = useHistory();

    // Redux state:
    const authState = useSelector(state => state.authenticationState);

        return (
            <div id='sidenav'> {/*for connecting to grid area*/}

                <div className='sidenav'>

                    <ul id='home-link'><li onClick={e => history.push('/')}>Home</li></ul>

                    <ul>
                        {authState.isAuthenticated?
                        <li onClick={e => history.push('/create')}><img src={sidenav_plus_icon} alt='+'/>Create a quote</li>
                        :""}

                        {authState.isAuthenticated?
                        <li onClick={e => history.push('/profile')}><img src={sidenav_user_icon} alt='?'/>My profile</li>
                        :<li onClick={e => history.push('/login')}><img src={sidenav_user_icon} alt='?'/>Login</li>}

                        {authState.isAuthenticated?
                        <li onClick={e => history.push('/favorites')}><img src={sidenav_favorites_icon} alt='*'/>My favorites</li>
                        :""}

                        <h4>Categories</h4>
                        <li onClick={e => history.push('/categories/history')}>History</li>
                        <li onClick={e => history.push('/categories/philosophy')}>Philosophy</li>
                        <li onClick={e => history.push('/categories/politic')}>Politic</li>
                        <li onClick={e => history.push('/categories/science')}>Science</li>
                        <li onClick={e => history.push('/categories/humor')}>Humor</li>
                        <li onClick={e => history.push('/categories/inspirational')}>Inspirational</li>
                        <li onClick={e => history.push('/categories/entertainment')}>Entertainment</li>
                        <li onClick={e => history.push('/categories/fictional')}>Fictional</li>
                    </ul>
                </div>
                
            </div>
        );
    

}