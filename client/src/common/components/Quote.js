//Modules
import {useEffect, useState} from 'react';
import upvote_icon from 'common/images/upvote_icon.svg';
import downvote_icon from 'common/images/downvote_icon.svg';
import favorite_icon from 'common/images/favorite_icon.svg';
import favorited_icon from 'common/images/favorited_icon.svg';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import { URL } from 'utils/rest_api.json';
import time_icon from 'common/images/time_icon.svg';
import location_icon from 'common/images/location_icon.svg';

//Styles
import './styles/Quote.css';

function Quote (props) {
 
    // Component state
    const history = useHistory();
    const [likeLoading, setLikeLoading] = useState(false);
    const [likeStatus, setLikeStatus] = useState((props.user_like_status)? props.user_like_status : 0);
    const [_likes, setLikes] = useState((props.likes)? props.likes : "-");
    const [favorited, setFavorited] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    //Redux state
    const authState = useSelector(state => state.authenticationState);

    // Quote data:
    var { id, said_by, quotetext, when, when_string, location, likes, user_name, comments, user_like_status, user_favorite_status, categories } = props;

    useEffect(() =>{
        // Has the user favorited the quote?
        setFavorited(user_favorite_status === "1");
    }, [user_favorite_status]);

    // likes before redux state has updated
    if (likeStatus !== user_like_status){
        user_like_status = likeStatus;
        likes = _likes;
    }
    
    // Create CSS classes for the upvote and downvote buttons
    const upvoted = user_like_status > 0;
    const downvoted = user_like_status < 0;
    const upvoteClasses = `upvote ${upvoted? 'upvoted': ''}`;
    const downvoteClasses = `downvote ${downvoted? 'downvoted' : ''}`;

    //likes are returned as string, so parse to int
    try{ likes = parseInt(likes) } 
    catch{ likes = '-' }

    // Create CSS styles for the likes
    var likesClass = 'like-amount';
    if (likes > 0){
        likesClass = 'like-amount positive';
        likes = '+' + likes;
    }
    else if (likes === 0)
        likesClass = 'like-amount neutral';
    else if (likes < 0)
        likesClass = 'like-amount negative';

    // Create CSS classes for the favorite button
    const favoriteCSS = (authState.isAuthenticated)? 'favorite-button' : 'favorite-button hidden';

    // Refactor the 'when' data field
    if(when)
        when = when.slice(0, 10).replaceAll("-", "/");
    if (when_string)
        when = '';


    // The quote was liked or favorited -> update the data
    const updateQuote = (quote) => {
        setLikeStatus(quote.user_like_status);
        setLikes(quote.likes);
        setLikeLoading(false);
        setFavorited(quote.user_favorite_status === "1");
        setFavoriteLoading(false);
        // If the quote is rendered on a list or carousel, here we update the list
        if(props.handleListUpdate)
            props.handleListUpdate(quote, props.index);
    }

    // User clicked on like button -> Send the new like status to server
    const likeQuote = () => {
        setLikeLoading(true)
        const newLikeStatus = (likeStatus > 0)? 0 : 1; 
        axios.post(URL+"/quotes/like/"+id, {likeStatus: newLikeStatus})
        .then(res=>{
            if(res.status === 200)
                updateQuote(res.data.quote);
        })
        .catch(err=>{
            setLikeLoading(false);
        })
    }

    // User clicked on dislike button -> Send the new like status to server
    const dislikeQuote = () => {
        setLikeLoading(true)
        const newLikeStatus = (likeStatus < 0)? 0 : -1; 
        axios.post(URL+"/quotes/like/"+id, {likeStatus: newLikeStatus})
        .then(res=>{
            if(res.status === 200)
                updateQuote(res.data.quote);
        })
        .catch(err=>{
            setLikeLoading(false);
        })
    }

    // User clicked on favorite button -> Send new favorite status to server
    const favoriteQuote = () => {
        setFavoriteLoading(true);
        axios.post(URL+"/quotes/favorite/"+id)
        .then(res=>{
            if(res.status === 200)
                updateQuote(res.data.quote);
        })
        .catch(err=>{
            setFavoriteLoading(false);
        })
    }

    // The like and dislike buttons
    const Likes = () => {
        return (
            <div className='quote-likes'>
                <button className={upvoteClasses} onClick={likeQuote} disabled={!authState.isAuthenticated || likeLoading}>
                    <img src={upvote_icon} alt='upvote' />
                </button>

                <p className={likesClass}>{likes}</p>

                <button className={downvoteClasses} onClick={dislikeQuote} disabled={!authState.isAuthenticated || likeLoading}>
                    <img src={downvote_icon} alt='downvote'/>
                </button>
            </div>
        );
    }

    // Button for adding/removing quote to/from favorites
    const FavoriteButton = () => {
        return(
            <button className={favoriteCSS} onClick={favoriteQuote} disabled={favoriteLoading}>
                <img src={favorited? favorited_icon: favorite_icon} alt='favourite'></img>
            </button>
        );
    }

    // The quotephrase and the person who said it (+ time + location)
    const QuoteContent = () => {
        return (
            <div className='quote-content' onClick={e => history.push("/quote/"+id)}>
                <p className='quotetext'>"{quotetext}"</p>
                <div className='said-by'>-{said_by}
                    {(when || when_string || location)? ', ' : ''}
                    <span className='further-details'>
                        {when? <div><img className='time-icon' src={time_icon} alt='?'/>{when}</div>: ''}
                        {when_string? <div><img className='time-icon' src={time_icon} alt='?'/>{when_string}</div>: ''}
                        {((when || when_string) && location)? ', ' : ''}
                        {location? <div><img className='location-icon' src={location_icon} alt='?'/>{location}</div>: ''}
                    </span>
                </div>
            </div>
        );
    }

    // Number of comments on the quote
    const Comments = () => {
        return (
            <div className='quote-comments'>
                <span className='comments-link' onClick={e => history.push("/quote/"+id)}>
                    {comments} comments
                </span>
            </div>
        );
    }

    const Categories = () => {
        const format = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        var categories = props?.categories;
        return(
            <div className='quote-categories'>
                {categories.map((category, index) => 
                    <div className='category' key={index}>
                        <span className='category-text'>{format(category)}</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className='quote-wrapper'>
            {(user_name)?
            <p className='user-name'>Posted by <span>{user_name}</span></p>:
            <p className='user-name deleted-user'>Posted by <span>(deleted user)</span></p>}
            
            <div className='quote'>
                    <div className='quote-interactions'>
                        <Likes/>
                        <FavoriteButton/>
                    </div>
                    <QuoteContent/>
                    <Comments/>
                    {categories ? <Categories categories/> : <></>}
            </div>
        </div>
    );
}

export default Quote;