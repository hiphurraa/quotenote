import db from "./index.js";

const Comment = {};

///////////////  LOGGED IN ///////////////////

Comment.getByQuoteLoggedIn = (quoteId, userId) => {
    try{
        const commentQuery =  "SELECT comment.*, "+
        "PUBLIC.user.name AS user_name, "+
        "((SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = false) - "+
        "(SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = true)) AS likes, "+
        "(SELECT((SELECT COUNT(*) FROM comment_like WHERE comment_id=comment.id AND is_negative = FALSE AND user_id = $2) - " +
        "(SELECT COUNT(*) FROM comment_like WHERE comment_id=comment.id AND is_negative = TRUE AND user_id = $2))) AS user_like_status " +
        "FROM comment "+
        "LEFT JOIN PUBLIC.user "+
        "ON PUBLIC.user.id = comment.user_id "+
        "WHERE quote_id=$1 "+
        "ORDER BY posted DESC; ";
        return db.any(commentQuery, [quoteId, userId]);
    }catch(err){
        console.log(err);
    }
}

Comment.create = (commentData, userId) => {
    const {quoteId, comment} = { ...commentData };
    try{
        return db.one('INSERT INTO comment (commenttext, posted, user_id, quote_id) VALUES ($1, $2, $3, $4) RETURNING id;',
        [comment, new Date(), userId, quoteId]);
    }catch(err) {
        console.log(err);
    }
}

Comment.delete = (commentId) => {
    try{
        return db.query('DELETE FROM comment WHERE id=$1', commentId);
    }catch(err){
        console.log(err);
    }
}

Comment.updateComment = (id, text) => {
    try {
        return db.query('UPDATE comment SET commenttext=$1 WHERE id=$2', [text, id]);
    } catch (err) {
        console.log(err);
    }
}

Comment.newLike = (comment_id, user_id, is_negative) => {
    try {
        return db.query('INSERT INTO comment_like VALUES ($1, $2, $3);', [user_id, comment_id, is_negative])
    } catch (err) {
        console.log(err);
    }
}

Comment.flipLike = (comment_id, user_id, is_negative) => {
    try {
        return db.query('UPDATE comment_like SET is_negative=$1 WHERE comment_id=$2 AND user_id=$3', [is_negative, comment_id, user_id])
    } catch (err) {
        console.log(err);
    }    
}

Comment.removeLike = (comment_id, user_id) => {
    try {
        return db.query('DELETE FROM comment_like WHERE comment_id=$1 AND user_id=$2', [comment_id, user_id])
    } catch (err) {
        console.log(err);
    }
}

Comment.getByCommentIdLoggedIn = (commentId, userId) => {
    try {
        const commentQuery =  "SELECT comment.*, "+
        "PUBLIC.user.name AS user_name, "+
        "((SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = false) - "+
        "(SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = true)) AS likes, " +
        "(SELECT((SELECT COUNT(*) FROM comment_like WHERE comment_id=comment.id AND is_negative = FALSE AND user_id = $2) - " +
        "(SELECT COUNT(*) FROM comment_like WHERE comment_id=comment.id AND is_negative = TRUE AND user_id = $2))) AS user_like_status " +
        "FROM comment "+
        "LEFT JOIN PUBLIC.user "+
        "ON PUBLIC.user.id = comment.user_id "+
        "WHERE comment.id = $1 ";
        return db.oneOrNone(commentQuery, [commentId, userId]);
    } catch (err) {
      console.log(err);
    }
}



///////////////  NOT LOGGED IN ///////////////////

Comment.getByQuote = (quoteId) => {
    try{
        const commentQuery =  "SELECT comment.*, "+
        "PUBLIC.user.name AS user_name, "+
        "((SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = false) - "+
        "(SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = true)) AS likes "+
        "FROM comment "+
        "LEFT JOIN PUBLIC.user "+
        "ON PUBLIC.user.id = comment.user_id "+
        "WHERE quote_id=$1 "+
        "ORDER BY posted DESC; ";
        return db.any(commentQuery, quoteId);
    }catch(err){
        console.log(err);
    }
}

Comment.getCommenter = (commentId) => {
    try {
        return db.oneOrNone('SELECT * FROM comment WHERE id=$1', [commentId]);
    } catch (err) {
        console.log(err);
    }
}

Comment.likedBy = (comment_id, user_id) => {
    try{
        return db.oneOrNone('SELECT * FROM comment_like WHERE comment_id=$1 AND user_id=$2;', [comment_id, user_id]);
    }catch(err){
        console.log(err);
    }
}

Comment.getByCommentId = (commentId) => {
    try {
        const commentQuery =  "SELECT comment.*, "+
        "PUBLIC.user.name AS user_name, "+
        "((SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = false) - "+
        "(SELECT COUNT(*) FROM comment_like WHERE comment_id = comment.id AND is_negative = true)) AS likes "+
        "FROM comment "+
        "LEFT JOIN PUBLIC.user "+
        "ON PUBLIC.user.id = comment.user_id "+
        "WHERE comment.id = $1 ";
        return db.oneOrNone(commentQuery, [commentId]);
    } catch (err) {
      console.log(err);
    }
}

export default Comment;