import './styles/NavBar.css';
import { Link } from 'react-router-dom';
import user_icon from 'common/images/user_icon.svg';
import search_icon from 'common/images/search_icon.svg';
import plus_icon from 'common/images/plus_icon.svg';
import searchbar_search_icon from 'common/images/searchbar_search_icon.svg';
import arrow_right from 'common/images/arrow_right.svg';
import x_icon from 'common/images/x_icon.svg';
import { useSelector, useDispatch } from 'react-redux';
import { mobileMenuActions } from '../state/mobileMenuState';
import { searchBarActions } from '../state/searchBarState';
import { useState } from 'react';
import Quote from 'common/components/Quote';
import axios from "axios";
import { URL } from 'utils/rest_api.json';

export default function Navbar () {

    // Redux state:
    const dispatch = useDispatch();
    const authState = useSelector(state => state.authenticationState);
    const searchBarState = useSelector(state => state.searchBarState);

    // Component state
    const [ searchString, setSearchString ] = useState("");
    const [ searchResults, setSearchResults ] = useState([]);
    const [ sentSearchString, setSentSearchString ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ emptyResult, setEmptyResult ] = useState(false);
    const [ error, setError ] = useState(false);

    // If user is logged in, show username, otherwise login link
    const LoginLinkOrUsername = () => {
        if (authState.isAuthenticated){
            return (
                <div>
                    <Link to='/profile' className='sign-in-link' onClick={e=>dispatch(searchBarActions.close())}>
                        <img className='navbar-img' src={user_icon} alt='sign in'></img>{authState.user.name}
                    </Link>
                </div>
            );
        }
        else{
            return (
                <div>
                    <Link to='/login' className='sign-in-link' onClick={e=>dispatch(searchBarActions.close())}>
                        <img className='navbar-img' src={user_icon} alt='sign in'></img>Log in
                    </Link>
                </div>
            );
        }
    }

    // QuoteNote logo
    const Logo = () => {
        return (
            <div className='logo'>
                <Link to='/' onClick={e=>dispatch(searchBarActions.close())}>
                    <h4>QuoteNote</h4>
                </Link>
            </div>
        );
    };

    const Links = () => {
        return (
            <ul className="links" id='desktop-view'>

                {/*CREATE QUOTE LINK*/}
                <li>
                    <Link   to='/create'
                            onClick={e=>dispatch(searchBarActions.close())}
                            className='create-link'>
                        <img    className='navbar-img'
                                src={plus_icon} 
                                alt='create quote'>
                        </img>
                        Create a quote
                    </Link>
                </li>

                {/*SEARCH LINK*/}
                <li onClick={e=>dispatch(searchBarActions.toggle())}>
                    <Link   onClick={e=>e.preventDefault()}
                            to='/' 
                            className='search-link'>
                            <img    className='navbar-img'
                                    src={search_icon} 
                                    alt='search'>
                            </img>
                            Search
                    </Link>
                </li>

                <li>
                    <LoginLinkOrUsername/>
                </li>
            </ul>
        );
    };

    // Links that show when the page is viewed from mobile-sized window
    const MobileLinks = () => {
        return (
            <ul className='links' id='mobile-view'>
                <li onClick={e=>dispatch(searchBarActions.toggle())}>
                    <Link onClick={e=>e.preventDefault()} to='/' className='search-link'><img src={search_icon} alt='search'></img></Link>
                </li>
                <div className='burger' onClick={e => dispatch(mobileMenuActions.toggle())}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </ul>
        );
    };

    const resetSearch = () => {
        setSearchResults([]);
        setSearchString("");
        setEmptyResult(false);
        setError(false);
    }

    const search = () => {
        setLoading(true);
        setSentSearchString(searchString);
        setEmptyResult(false);
        axios
        .post(URL+"/quotes/search", {searchString})
        .then(res => {
            setLoading(false);
            setSearchResults(res.data.data);
            setError(false);
            if (res.data.data.length < 1){
                setEmptyResult(true);
            }
            else{
                setEmptyResult(false);
            }
          })
        .catch(err => {
            setError(true);
            setLoading(false);
            setEmptyResult(false);
        });
    }

    const SearchResults = () => {
        return(
            <div>
                <div className='search-results-header'>
                    <h2>Search results for "{sentSearchString}" - {searchResults.length} result{(searchResults.length>1)? 's':''}</h2>
                </div>
                
                <div className='search-results'>
                    {searchResults.slice(0, 15).map((quote) =>
                        <div className='list-item' key={quote.id}>
                            <Quote {...quote}/>
                        </div>
                    )}
                </div>
            </div>
           
        );
    }


    return (
        <div className='navbar'>
            <div className='sticky-nav'>
                <nav>
                    <Logo/>
                    <Links/>
                    <MobileLinks/>

                    {(searchBarState.show)?
                        // Search bar that appears, when the search link is clicked
                        <div>
                            <div className='blur-background'>
                            </div>
                                <div className='search-view'>

                                    <form onSubmit={e=>{e.preventDefault();search();}}>
                                        <div className='search-items'>

                                                <div className='search-bar'>
                                                    <div className='search-icon'>
                                                        <img src={searchbar_search_icon} alt='?'></img>
                                                    </div>
                                                    <div className='search-input'>
                                                        <input  type='text' placeholder='Search for quotes...' 
                                                                value={searchString} onChange={e=>setSearchString(e.target.value)} autoFocus/>
                                                    </div>
                                                    <div className='search-button' onClick={e=>search()}>
                                                        <img src={arrow_right} alt='search'></img>
                                                    </div>
                                                </div>
                                            
                                            <div className='close-button' onClick={e=>{dispatch(searchBarActions.close());resetSearch()}}>
                                                <img src={x_icon} alt='close'/>
                                            </div>
                                        </div>
                                    </form>

                                    {loading? <h3 className='state-message'>Loading...</h3>:''}

                                    {emptyResult? <h3 className='state-message'>No results for "{sentSearchString}"</h3>:''}

                                    {error? <h3 className='state-message'>Sorry! Unexpected error happened!</h3>:''}

                                    {(searchResults.length>0 && !loading)? <SearchResults/>:''}

                                </div>
                        </div>
                    :''}
                </nav>
            </div>
        </div>
    );
}