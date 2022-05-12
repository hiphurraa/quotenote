// Modules
import { React, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getComments, postComment } from './api/quotePageApi';
import { useParams } from 'react-router-dom';
import { quotePageActions } from 'pages/QuotePage/state/quotePageState';
import upvote_icon from 'common/images/upvote_icon.svg';
import downvote_icon from 'common/images/downvote_icon.svg';
import { URL } from 'utils/rest_api.json';
import axios from "axios";
import { dialogActions } from 'common/state/dialogBoxState';

// Styles
import './styles/CommentSection.css';

export default function CommentSection () {

    // Component state
    const [commenttext, setCommenttext] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [likesLoading, setLikesLoading] = useState(false);
    const [ editCommentId, setEditCommentId ] = useState(null);
    const [ editCommenttext, setEditCommenttext] = useState('');
    const [ highlightCommentId, setHighlightCommentId] = useState(null);

    // Redux state
    const quotePageState = useSelector(state => state.quotePageState);
    var comments = quotePageState.comments;
    const authState = useSelector(state => state.authenticationState);
    const roles = authState.user.roles;
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(quotePageActions.setCommentPostErrors(false));
        getComments(id, dispatch, true);

        return function cleanup () {
            dispatch(quotePageActions.resetState());
        };
    }, [id, dispatch]);


    // After succesfully posting comment
    const handleSuccesfulComment = () => {
        setSuccessMessage("Comment posted succesfully!");
        setCommenttext("");
        getComments(id, dispatch);
        setTimeout(() => {  setSuccessMessage(""); }, 2000);
    }

    // Posts a commment to the database
    const sendComment = () => {
        const commentData = { comment:commenttext, quoteId: id };
        postComment(commentData, dispatch, handleSuccesfulComment);
    }

    // User clicked on a like button of a comment
    const likeComment = (comment_id, index) => {
        setLikesLoading(true);
        const oldLikeStatus = parseInt(quotePageState.comments[index].user_like_status)
        const newLikeStatus = (oldLikeStatus > 0)? 0 : 1;

        axios.post(URL+"/comments/like/"+comment_id, {likeStatus: newLikeStatus})
        .then(res=>{
            if(res.status === 200){
                // Update comment data
                let comments = quotePageState.comments;
                comments[index] = res.data.comment;
                quotePageActions.setComments(comments);
                setLikesLoading(false);
            }
        })
        .catch(err=>{
            console.log(err);
            getComments(id, dispatch);
            setLikesLoading(false);
        })
    }

    // User clicked on a dislike button of a comment
    const dislikeComment = (comment_id, index) => {
        setLikesLoading(true);
        const oldLikeStatus = parseInt(quotePageState.comments[index].user_like_status)
        const newLikeStatus = (oldLikeStatus < 0)? 0 : -1;

        axios.post(URL+"/comments/like/"+comment_id, {likeStatus: newLikeStatus})
        .then(res=>{
            if(res.status === 200){
                // Update comment data
                let comments = quotePageState.comments;
                comments[index] = res.data.comment;
                quotePageActions.setComments(comments);
                setLikesLoading(false);
            }
        })
        .catch(err=>{
            console.log(err);
            setLikesLoading(false);
        })
    }

    // Delete the comment from the quote
    const deleteComment = (comment_id) => {
        setHighlightCommentId(comment_id);
        axios.delete(URL+"/comments/"+comment_id)
        .then(res=>{
            if(res.status === 200){
                getComments(id, dispatch, false);
            }
        })
        .catch(err=>{
            dispatch(dialogActions.appear("inform", "Oops! Something wen wrong with deleting the comment.", ()=>{}));
        })
    }

    // Verify, if the user wants to delete the comment
    const verifyDelete = (comment_id) => {
        setHighlightCommentId(null);
        dispatch(dialogActions.appear("confirm-delete", "Are you sure you want to delete the comment?", deleteComment, comment_id));
    }

    const editComment = (commentData) => {

        // Update first locally for snappy interaction
        for (const comment of comments) {
            if (comment.id === commentData.id)
                comment.commenttext = commentData.commenttext;
        }
        setEditCommentId(null);
        setHighlightCommentId(commentData.id);

        // Then send to server and update the whole comment field
        axios.put(URL+"/comments/"+commentData.id, {comment:commentData.commenttext})
        .then(res=>{
            if(res.status === 200){
                getComments(id, dispatch, false);
            }
        })
        .catch(err=>{
            dispatch(dialogActions.appear("inform", "Sorry! Something went wrong with editing the comment."));
        })
    }

    // Verify, if the user wants to delete the comment
    const verifyCommentEdit = (commentData) => {
        dispatch(dialogActions.appear("confirm", "Are you sure you want to edit the comment?", editComment, commentData));
    }



    /* LOADING MESSAGE */
    if (quotePageState.isCommentsLoading){
        return(
            <div className='comment-section'>
                Loading...
            </div>
        );
    }
    /* ERROR MESSAGE */
    else if (quotePageState.commentsErrors){
        return (
            <div>
                Server connection error!
            </div>
        );
    }
    /* RENDER NORMALLY */
    else {
        const errorMessage = quotePageState.commentPostErrors[Object.keys(quotePageState.commentPostErrors)[0]];
        const placeHolder = authState.isAuthenticated? "Leave a comment..." : "Log in to leave a comment."

        // Format the data of comments
        for(const comment of comments){
            comment.posted = comment.posted.slice(0, 10).replaceAll("-", "/");
            comment.likes = parseInt(comment.likes);
            if (comment.likes > 0)
                comment.likes = "+" + comment.likes;
            if(comment.user_like_status)
                comment.user_like_status = parseInt(comment.user_like_status);
        }

        return(
            <div className='comment-section'>

                {errorMessage? <p className='comment-error-message'>{errorMessage}!</p>:
                <p className='comment-success-message'>{successMessage}</p>}

                <div className='post-comment'>
                    <textarea   disabled={!authState.isAuthenticated}
                                placeholder={placeHolder}
                                onChange={e => setCommenttext(e.target.value)}
                                value={commenttext}>
                    </textarea>
                    <button disabled={!authState.isAuthenticated}
                            className='comment-button' 
                            onClick={sendComment}>
                            Send
                    </button>
                </div>

                {comments.map((comment, index) => {
                    if(comment.id !== editCommentId)
                        return(
                            /* NORMAL COMMENT VIEW */
                            <div    className={highlightCommentId === comment.id? 'highlight-comment comment' : 'comment'} 
                                    key={comment.id}>

                            {(authState.user.id === comment.user_id)?
                            <div id='comment-buttons'>
                                <span onClick={e=>{
                                    setEditCommentId(comment.id);
                                    setEditCommenttext(comment.commenttext);
                                    setHighlightCommentId(null);
                                }}>Edit</span>
                                <span onClick={e=>verifyDelete(comment.id)}>Delete</span>
                            </div>:''}

                            {/*Show this delete-link if not own comment and user has admin or moderator role. Sorry for horrible code :)*/}
                            {( (authState.user.id !== comment.user_id) && (roles && (roles.includes("admin") || roles.includes("moderator"))) )?
                            <div id='comment-buttons'>
                            <span className='admin-moderator' onClick={e=>verifyDelete(comment.id)}>(Delete)</span>
                            </div>:''}

                            <div id='comment-likes'>

                                <button className={(comment.user_like_status === 1)? 'comment-upvote upvoted': 'comment-upvote'}
                                        onClick={e => likeComment(comment.id, index)}
                                        disabled={!authState.isAuthenticated || likesLoading}>
                                    <img    src={upvote_icon} 
                                            alt='upvote'>
                                    </img>
                                </button>

                                <p className={"like-amount " + (comment.likes > 0? 'positive' : '') + (comment.likes < 0? 'negative' : '')}>{comment.likes}</p>

                                <button className={(comment.user_like_status === -1)? 'comment-downvote downvoted' : 'comment-downvote'}
                                        onClick={e => dislikeComment(comment.id, index)}
                                        disabled={!authState.isAuthenticated || likesLoading}>
                                    <img    src={downvote_icon} 
                                            alt='downvote'>
                                    </img>
                                </button>
                            </div>

                            <div id='comment-content'>
                                <p>
                                    {(comment.user_name)?
                                    <span className='comment-user'>{comment.user_name}</span>:
                                    <span className='comment-user deleted-user'>(deleted user)</span>}
                                    
                                    <span className='comment-posted'>{comment.posted}</span>
                                </p>
                                <p className='comment-text'>
                                    <span>{comment.commenttext}</span>
                                </p>
                            </div>

                        </div>)
                        else
                            return(
                                /* EDITING COMMENT */
                                <div    className='editing-comment' 
                                        key={comment.id}>
                                        
                                    <p>Edit comment:</p>

                                    <textarea  autoFocus
                                            className='commenttext-input' 
                                            value={editCommenttext} 
                                            /*onFocus trick to place the cursor to end of the text*/
                                            onFocus={e=> {e.target.value =''; e.target.value = editCommenttext} } 
                                            onChange={e => setEditCommenttext(e.target.value)}/>

                                    <button className='save-edit-button' 
                                            onClick={e=> {verifyCommentEdit({id: comment.id, commenttext:editCommenttext})}}
                                            disabled={(comment.commenttext === editCommenttext) || (editCommenttext.length < 1)}>
                                    Save</button>

                                    <button className='cancel-edit-button'
                                            onClick={e=>{setEditCommentId(null)}}>
                                    Cancel</button>

                                </div>
                            )

                    }
                    
                )}

                {comments.length < 1? <div className='no-comments-message'>There are no comments yet.</div> : ""}

            </div>
        );
    }

}