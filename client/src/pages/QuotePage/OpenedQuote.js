// Modules
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getQuote } from './api/quotePageApi';
import CommentSection from './CommentSection';
import upvote_icon from 'common/images/upvote_icon.svg';
import downvote_icon from 'common/images/downvote_icon.svg';
import favorite_icon from 'common/images/favorite_icon.svg';
import favorited_icon from 'common/images/favorited_icon.svg';
import PopupMenu from './PopupMenu';
import { URL } from 'utils/rest_api.json';
import axios from "axios";
import time_icon from 'common/images/time_icon.svg';
import location_icon from 'common/images/location_icon.svg';

// Styles
import './styles/OpenedQuote.css';

export default function OpenedQuote () {

    // Component state
    const [likeLoading, setLikeLoading] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    

    // Redux state
    const quotePageState = useSelector(state => state.quotePageState);
    const authState = useSelector(state => state.authenticationState);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        getQuote(id, dispatch, true);
    }, [id, dispatch]);


    // User clicked like button -> Send new like status to server and refresh the quote
    const likeQuote = () => {
        setLikeLoading(true);
        const newLikeStatus = (quotePageState.quote.user_like_status > 0)? 0 : 1;

        axios.post(URL+"/quotes/like/"+id, {likeStatus: newLikeStatus})
        .then(res=>{
            if(res.status === 200){
                getQuote(id, dispatch, false);
                setLikeLoading(false);
            }
        })
        .catch(err=>{
            console.log(err);
            setLikeLoading(false);
        })
    }

    // User clicked dislike button -> Send new like status to server and refresh the quote
    const dislikeQuote = () => {
        setLikeLoading(true);
        const newLikeStatus = (quotePageState.quote.user_like_status < 0)? 0 : -1;

        axios.post(URL+"/quotes/like/"+id, {likeStatus: newLikeStatus})
        .then(res=>{
            if(res.status === 200){
                getQuote(id, dispatch, false);
                setLikeLoading(false);
            }
        })
        .catch(err=>{
            console.log(err);
            setLikeLoading(false);
        })
    }

    // User clicked on favorite button -> Send new favorite status to server
    const favoriteQuote = () => {
        setFavoriteLoading(true);
        axios.post(URL+"/quotes/favorite/"+id)
        .then(res=>{
            if(res.status === 200)
            getQuote(id, dispatch, false);
            setFavoriteLoading(false);
        })
        .catch(err=>{
            setFavoriteLoading(false);
        })
    }


    if(quotePageState.isQuoteLoading){
        return(
            <div className='opened-quote'>
                Loading...
            </div>
        )
    }
    else if (quotePageState.quoteErrors){
        return(
            <div className='opened-quote'>
                <div className='error-message'>
                    {quotePageState.quoteErrors.error}
                </div>
            </div>
        );
    }
    else {

        let { quotetext, said_by, when, when_string, location, likes, user_name, comments, user_favorite_status, user_like_status, categories } = quotePageState.quote;

        // Has the user favorited the quote?
        const favorited = (user_favorite_status === "1");

        // Create CSS classes for the favorite button
        const favoriteCSS = (authState.isAuthenticated)? 'favorite-button' : 'favorite-button hidden';

        // User like status
        const upvoted = user_like_status > 0;
        const downvoted = user_like_status < 0;
        const upvoteClasses = `upvote ${upvoted? 'upvoted': ''}`;
        const downvoteClasses = `downvote ${downvoted? 'downvoted' : ''}`;

        //likes are returned as string, so parse to int
        try{ likes = parseInt(likes) } 
        catch{ likes = '-' }

        // Create CSS classes for the upvote and downvote buttons
        var likesClass = 'like-amount';
        if (likes > 0){
            likesClass = 'like-amount positive';
            likes = '+' + likes;
        }
        else if (likes === 0){
            likesClass = 'like-amount neutral';
        }
        else if (likes < 0){
            likesClass = 'like-amount negative';
        }

        // Refactor the 'when' data field
        if(when)
            when = when.slice(0, 10).replaceAll("-", "/");
        if (when_string)
            when = '';


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
                <div className='quote-content'>
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
                    {comments} comments
                </div>
            );
        }

        const Categories = () => {
            const format = (str) => {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
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
            <div className='opened-quote'>
                <div className='quote-wrapper'>
                    {(user_name)?<p className='user-name'>Posted by <span>{user_name}</span></p>:<p className='user-name deleted-user'>Posted by <span>(deleted user)</span></p>}
                    <div className='quote'>
                            <div className='quote-interactions'>
                                <Likes/>
                                <FavoriteButton/>
                            </div>
                            <QuoteContent/>
                            <PopupMenu/>
                            <Comments/>
                            {categories ? <Categories categories/> : <></>}
                    </div>
                </div>
                <CommentSection/>
            </div>
        );

    }
}