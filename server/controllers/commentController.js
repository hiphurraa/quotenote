import Comment from "../models/commentModel.js";
import { validateCommentData } from "../validation/comments.js";
import { validateCommentLike } from "../validation/like.js";
import User from "../models/userModel.js";
import db from "../models/index.js";

export const createComment = async (req, res) => {
  const { errors, isValid } = validateCommentData(req.body);
  //console.log(req.user);

  if (!isValid) {
    //If request isn't valid
    return res.status(400).json(errors);
  }

  Comment.create(req.body, req.user.id)
    .then((data) => res.status(200).json({ title: "Posted comment", id: data.id }))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
};

export const getByQuote = async (req, res) => {
  const quoteId = req.params.id;

  if (req.user){
    try{
      const comments = await Comment.getByQuoteLoggedIn(quoteId, req.user.id);
      return res.status(200).json({title: "Retrieved comments for the quote", data:comments});
    }catch(err){console.log(err); return res.status(500).json({"error": "Unexpected error!"})}
  }

  try{
    const comments = await Comment.getByQuote(quoteId);
    return res.status(200).json({title: "Retrieved comments for the quote", data:comments});
  }catch(err){console.log(err); return res.status(500).json({"error": "Unexpected error!"})}

};

export const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const result = await User.getRoles(userId);
  const roles = result.map((role) => role.name);

  const commenter = await Comment.getCommenter(commentId);

  //If commenter isn't found --> No comment with that Id
  if (!commenter) return res.status(404).json({ title: "Comment not found" });

  if (roles.includes("admin") || roles.includes("moderator")) {
    //Allow delete on moderator or admin users
    Comment.delete(commentId)
      .then((data) => {
        if (data) res.status(200).json({ title: "Deleted comment", data });
        else res.status(400).json({ title: "No comment found " });
      })
      .catch((err) => res.status(500).json(err));
  } else {
    //Else check if comment if users
    
    if (commenter.user_id === userId) {
      //If user is the commenter, delete comment
      Comment.delete(commentId)
        .then((data) => {
          if (data) res.status(200).json({ title: "Deleted comment", data });
          else res.status(400).json({ title: "No comment found " });
        })
        .catch((err) => res.status(500).json(err));
    } else {
      //Otherwise 401 unauthorized
      res.status(401).json({ title: "Unauthorized" });
    }
  }
};

export const updateComment = async (req, res) => {
  const commentId = req.params.id;
  const text = req.body.comment;
  const commenter = await Comment.getCommenter(commentId);
  //If commenter isn't found --> No comment with that Id
  if (!commenter) return res.status(404).json({ title: "Comment not found " });
  if (req.user.id === commenter.user_id) {
    Comment.updateComment(commentId, text)
      .then((data) => res.status(200).json(data))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }else{
    res.status(401).json({ title: "Unauthorized" })
  }
};

export const likeComment = async (req, res) => {
  const user_id = req.user.id;
  const comment_id = req.params.id;
  
  
  //Validate request
  const { errors, isValid } = await validateCommentLike(comment_id, user_id);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  const likeStatus = req.body.likeStatus;
  const is_negative = (likeStatus === -1) ? true : false;
  const liked = await Comment.likedBy(comment_id, user_id);

  if(liked){ //There is a previous like/dislike
    if(likeStatus === 0){ //We can just remove the previous entry
      Comment.removeLike(comment_id, user_id)
        .then(async() => {
          const comment = await Comment.getByCommentIdLoggedIn(comment_id, user_id);
          res.status(200).json({ title: "Removed previous like/dislike", comment });
        })
        .catch(err => {console.log(err); res.status(500).json({ title: "Error updating database" });})
    }else if(is_negative === liked.is_negative){ //Wanted state is the same as in database
      const comment = await Comment.getByCommentIdLoggedIn(comment_id, user_id);
      res.status(200).json({ title: "Requested status is the same as in database", comment });
    }else{ //Otherwise we flip the like status
      Comment.flipLike(comment_id, user_id, is_negative)
        .then(async() => {
          const comment = await Comment.getByCommentIdLoggedIn(comment_id, user_id);
          res.status(200).json({ title: "Like status changed", comment })
        })
        .catch(err => {console.log(err); res.status(500).json({ title: "Error updating database" })})
    }
  }else{
    if(likeStatus === 0) return res.status(200).json({ title: "No like/dislike on comment" })
    Comment.newLike(comment_id, user_id, is_negative)
      .then(async() => {
        const comment = await Comment.getByCommentIdLoggedIn(comment_id, user_id);
        res.status(200).json({ title: "Like/dislike added", comment })
      })
      .catch(err => {console.log(err); res.status(500).json({ title: "Error updating database" })})
  }
}
