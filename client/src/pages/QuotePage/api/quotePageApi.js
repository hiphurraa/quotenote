import axios from "axios";
import { quotePageActions } from 'pages/QuotePage/state/quotePageState';
import { dialogActions } from 'common/state/dialogBoxState';
import { URL } from 'utils/rest_api.json';

// get comments for the quote
export const getQuote = (id, dispatch, showLoading) => {
    if(!id) return;
    
    if(showLoading)
      dispatch(quotePageActions.setQuoteIsLoading(true));

    axios
    .get(URL+"/quotes/"+id)
    .then(res => {
      if(res.data.data){
        dispatch(quotePageActions.setQuote(res.data.data));
      }
        
      else
        dispatch(quotePageActions.setQuoteErrors({"error": "Sorry! No quote exists with this ID."}));
    })
    .catch(err => {
      if (err.response && err.response.data){
        dispatch(quotePageActions.setQuoteErrors({"error": "Unexpected error!"}));
      }
      else {
        dispatch(quotePageActions.setQuoteErrors({"error": "Server connection error!"}));
      }
    });
};

// post a comment
export const postComment = (comment, dispatch, handleSuccesfulComment) => {

  dispatch(quotePageActions.setIsPostingComment(true));

  axios
    .post(URL+"/comments/", {...comment})
    .then(res => {
      dispatch(quotePageActions.setIsPostingComment(false));
      dispatch(quotePageActions.setCommentPostErrors(false));
      handleSuccesfulComment();
    })
    .catch(err => {
      if (err.response && err.response.data){
        dispatch(quotePageActions.setCommentPostErrors(err.response.data));
      }
      else {
        dispatch(quotePageActions.setCommentPostErrors({"error": "Server connection error!"}));
      }
    });

}

// Get comments for the quote
export const getComments = (quote_id, dispatch, showLoading) => {

  if (showLoading){
    dispatch(quotePageActions.setIsCommentsLoading(true));
  }

  axios
    .get(URL+"/comments/quote/"+quote_id)
    .then(res => {
      dispatch(quotePageActions.setComments(res.data.data));
    })
    .catch(err => {
      if (err.response && err.response.data){
        dispatch(quotePageActions.setCommentsErrors(err.response.data));
      }
      else {
        dispatch(quotePageActions.setCommentsErrors({"error": "Server connection error!"}));
      }
    });
}

export const removeQuote = (quote_id, history, dispatch) => {

  axios
  .delete(URL+"/quotes/"+quote_id)
  .then(res => {
    dispatch(dialogActions.appear("inform", "The quote was deleted succesfully.", ()=>{history.push("/")}));
  })
  .catch(err => {
    if (err.response && err.response.data){
      dispatch(dialogActions.appear("inform", "Sorry! There was an error deleting the quote.", ()=>{}));
    }
    else {
      dispatch(dialogActions.appear("inform", "Sorry! There was an error deleting the quote.", ()=>{}));
    }
  });

}