// Modules
import { Navbar, MobileMenu, SideNav } from 'common/components/';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import FavoritesList from './FavoritesList';
import favorited_icon from 'common/images/favorited_icon.svg';


// Styles
import 'common/styles/sidenav-grid.css';
import './styles/FavoritesPage.css';


export default function FavoritesPage () {

    // Redux state
    const authState = useSelector(state => state.authenticationState);

    if(authState.isAuthenticated){
            return (
                <div>
                    <Navbar/>
                    <MobileMenu/>
                    <div className='sidenav-grid'>
                        <SideNav/>
                        <div className='page-content'>{/*page-content begins*/}
        
                            <div className='favorites-page'>
                                <h3 className='favorites-heading'><img src={favorited_icon} alt='star-icon'></img> My favorites</h3>
                                <FavoritesList/>
                            </div>
        
                        </div>{/*page-content ends*/}
                    </div>
                </div>
            );
    }
    else{
        return(
            <Redirect to="/login"/>
        );
    }
    
};