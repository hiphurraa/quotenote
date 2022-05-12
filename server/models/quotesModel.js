import db from "./index.js";

const quoteQueryLoggedIn =
  "SELECT DISTINCT " +
  "quote.id, " +
  "quote.quotetext, " +
  "quote.when, " +
  "quote.when_string, " +
  "quote.said_by, " +
  "quote.location, " +
  "quote.user_id, " +
  "PUBLIC.user.name AS user_name, " +
  "(SELECT((SELECT COUNT(*) FROM quote_like WHERE quote_id = quote.id AND is_negative = FALSE) - " +
  "(SELECT COUNT(*) FROM quote_like WHERE quote_id = quote.id AND is_negative = TRUE))) AS likes, " +
  "(SELECT COUNT(*) FROM comment WHERE quote_id = quote.id) AS comments, " +
  "(SELECT((SELECT COUNT(*) FROM quote_like WHERE quote_id = quote.id AND is_negative = FALSE AND user_id = $1) - " +
  "(SELECT COUNT(*) FROM quote_like WHERE quote_id = quote.id AND is_negative = TRUE AND user_id = $1))) AS user_like_status, " +
  "(SELECT COUNT(*) FROM favorite WHERE quote_id = quote.id) AS favorites, " +
  "(SELECT COUNT(*) FROM favorite WHERE quote_id = quote.id AND user_id = $1) AS user_favorite_status, " +
  "(SELECT getCategoriesById(quote.id)) AS categories "+
  "FROM quote " +
  "LEFT JOIN PUBLIC.user " +
  "ON quote.user_id = PUBLIC.user.id " +
  "LEFT JOIN favorite " +
  "ON PUBLIC.user.id = favorite.user_id " +
  "LEFT JOIN quote_category " +
  "ON quote.id = quote_category.quote_id";

const Quote = {};



///////////////  LOGGED IN ///////////////////

Quote.getAllLoggedIn = (userId) => {
  try {
    return db.any(quoteQueryLoggedIn, userId);
  } catch (err) {
    console.log(err);
  }
};


//Get quote by id
Quote.getByQuoteIdLoggedIn = (quoteId, userId) => {
  try {
    return db.oneOrNone((quoteQueryLoggedIn + " WHERE quote.id=$2 LIMIT 1;"), [userId, quoteId]) //userId used in query constant
  } catch (err) {
    console.log(err);
  }
}

Quote.getByUserIdLoggedIn = (searchUserId, loggedUserId) => {
  try{
    return db.any((quoteQueryLoggedIn + " WHERE quote.user_id=$2 ORDER BY quote.id DESC"),[loggedUserId, searchUserId])
  }catch(err){
    console.log(err);
  }
}


//Get quotes that match search criteria (logged in)
Quote.getBySearchLoggedIn = (searchString, user_id, andOr) => {
  try {
    var str = searchString;
    str = str.split("*").join("%");
    str = str.split("?").join("_");
    var myRegExpr = /"[^"]+"|[^\s]+/g;
    var searchList = str.match(myRegExpr).map(e => e.replace(/"(.+)"/, "$1"));
    //console.log(searchList);
    var searchListLength = searchList.length;
    
    var query = quoteQueryLoggedIn + " WHERE";
    for (var i = 0; i < searchListLength; i++) {
      if (i != searchListLength-1) {
        query = query + " CONCAT(' ',LOWER(quote.quotetext),' ') SIMILAR TO LOWER('% " + searchList[i] + "_? %') " + andOr;
      }
      else {
        query = query + " CONCAT(' ',LOWER(quote.quotetext),' ') SIMILAR TO LOWER('% " + searchList[i] + "_? %')";
      }
    }
    return db.any(query, [user_id]);
  } catch (err) {
    console.log(err);
  }
}

//Get quotes matching given category (logged in)
Quote.getByCategoryLoggedIn = (user_id, category_id) => {
  try {
    return db.any((quoteQueryLoggedIn + " WHERE quote_category.category_id=$2;"), [user_id, category_id]);
  } catch(err) {
    console.log(err);
  }
}

//Get the most recent quotes
Quote.getMostRecentLoggedIn = (user_id) => {
  try {
    return db.any(quoteQueryLoggedIn + ' ORDER BY quote.id DESC LIMIT 100', [user_id]);
  } catch (err) {
    console.log(err);
  }
}

//Get quotes for the carousel
Quote.getCarouselLoggedIn = (user_id) => {
  try {
    //const query = quoteQuery + " WHERE LENGTH(quote.quotetext) < 301 ORDER by comments DESC LIMIT 100";
    return db.any(quoteQueryLoggedIn + ' WHERE LENGTH(quote.quotetext) < 301 ORDER by comments DESC LIMIT 100', [user_id]);
  } catch (err) {
    console.log(err);
  }
}


///////////////  NOT LOGGED IN ///////////////////


//Get all quotes
Quote.getAll = () => {
  try {
    return db.any('SELECT DISTINCT * FROM quote_extended;');
  } catch (err) {
    console.log(err);
  }
};


Quote.getByQuoteId = (quoteId) => {
  try{
    return db.oneOrNone('SELECT * FROM quote_extended WHERE id=$1 LIMIT 1;', quoteId);
  }catch(err){
    console.log(err);
  }
}


//Get quotes by user_id
Quote.getByUserId = async (user_id) => {
  try {
    return db.any('SELECT DISTINCT * FROM quote_extended WHERE quote_extended.user_id=$1 ORDER BY quote_extended.id DESC;', user_id);
  } catch (err) {
    console.log(err);
  }
};

//Get quotes for the carousel
Quote.getCarousel = () => {
  try {
    //const query = quoteQuery + " WHERE LENGTH(quote.quotetext) < 301 ORDER by comments DESC LIMIT 100";
    return db.any('SELECT DISTINCT * FROM quote_extended WHERE LENGTH(quote_extended.quotetext) < 301 ORDER by comments DESC LIMIT 100');
  } catch (err) {
    console.log(err);
  }
}

//Get the most recent quotes
Quote.getMostRecent = () => {
  try {
    return db.any('SELECT DISTINCT * FROM quote_extended ORDER BY quote_extended.id DESC LIMIT 100');
  } catch (err) {
    console.log(err);
  }
}

//Delete quote by id
Quote.delete = (id) => {
  try {
    return db.query("DELETE FROM quote WHERE id=$1", [id]);
  } catch (err) {
    console.log(err);
  }
};

//Update quote by id
Quote.update = (quoteId, newQuote) => {
  const { quotetext, when, when_string, said_by, location } = newQuote;

  if (when){
    try {
      return db.query(
        'UPDATE quote SET "quotetext" = $1, "when" = $2, "when_string" = null, "said_by" = $3, "location" = $4 WHERE "id"=$5;',
        [quotetext, when, said_by, location, quoteId]
      );
    } catch (err) {
      console.log(err);
    }
  }
  else {
    try{
      return db.query(
        'UPDATE quote SET "quotetext" = $1, "when_string" = $2, "when"=null, "said_by" = $3, "location" = $4 WHERE "id"=$5;',
        [quotetext, when_string, said_by, location, quoteId]
      );
    }
    catch(err){
      console.log(err);
    }
  }
  
};

//Create a quote
Quote.create = (quoteData) => {
  const { quotetext, when, when_string, said_by, location, user_id } = quoteData;

  if (when) { // 'when' is given in date format
    try {
      return db.one('INSERT INTO quote (quotetext, "when", when_string, said_by, location, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
        [quotetext, when, when_string, said_by, location, user_id]);
    } catch (err) {
      console.log(err);
    }
  }
  else {
    try {
      return db.one('INSERT INTO quote (quotetext, when_string, said_by, location, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
        [quotetext, when_string, said_by, location, user_id]);
    } catch (err) {
      console.log(err);
    }
  }

}

Quote.likedBy = (quote_id, user_id) => {
  try {
    return db.oneOrNone('SELECT * FROM quote_like WHERE user_id=$1 AND quote_id=$2 LIMIT 1;', [quote_id, user_id]);
  } catch (err) {
    console.log(err);
  }
};

Quote.newLike = (quote_id, user_id, is_negative) => {
  try {
    return db.query('INSERT INTO quote_like VALUES ($1, $2, $3);', [user_id, quote_id, is_negative]);
  } catch (err) {
    console.log(err);
  }
}

Quote.flipLike = (quote_id, user_id, is_negative) => {
  try {
    return db.query('UPDATE quote_like SET is_negative=$1 WHERE quote_id=$2 AND user_id=$3', [is_negative, quote_id, user_id])
  } catch (err) {
    console.log(err);
  }
};

Quote.removeLike = (quote_id, user_id) => {
  try {
    return db.query('DELETE FROM quote_like WHERE quote_id=$1 AND user_id=$2;', [quote_id, user_id]);
  } catch (err) {
    console.log(err);
  }
};

Quote.getLikes = (quote_id) => {
  const query = "SELECT((SELECT COUNT(*) FROM quote_like WHERE quote_id = $1 AND is_negative = FALSE) - " +
                "(SELECT COUNT(*) FROM quote_like WHERE quote_id = $1 AND is_negative = TRUE)) AS likes ";
  try{
    return db.oneOrNone(query, [quote_id]);
  }catch(err){
    console.log(err);
  }
}

//Favorite a quote by id
Quote.favorite = (id, user_id) => {
  try {
    return db.query("INSERT INTO favorite(user_id, quote_id) VALUES($1, $2)", [user_id, id]);
  } catch (err) {
    console.log(err);
  }
}

//Unfavorite a quote by id
Quote.removeFavorite = (id, user_id) => {
  try {
    return db.query("DELETE FROM favorite WHERE user_id = $1 AND quote_id = $2", [user_id, id]);
  } catch (err) {
    console.log(err);
  }
}

//Check if favorited by user
Quote.favoritedBy = (id, user_id) => {
  try {
    return db.oneOrNone("SELECT * FROM favorite WHERE user_id=$1 AND quote_id=$2 LIMIT 1", [user_id, id]);
  } catch (err) {
    console.log(err);
  }
}

//Get all favorites of user
Quote.getFavorites = (user_id) => {
  try {
    var query = quoteQueryLoggedIn;
    query = query + " WHERE (SELECT COUNT(*) FROM favorite WHERE quote_id = quote.id AND user_id = $1)=1";
    return db.any(query, [user_id]);
  } catch (err) {
    console.log(err);
  }
}

//Get quotes that match search criteria (not logged in)
Quote.getBySearch = (searchString, andOr) => {
  try {
    var str = searchString;
    str = str.split("*").join("%");
    str = str.split("?").join("_");
    var myRegExpr = /"[^"]+"|[^\s]+/g;
    var searchList = str.match(myRegExpr).map(e => e.replace(/"(.+)"/, "$1"));
    //console.log(searchList);
    var searchListLength = searchList.length;
    
    var query = " WHERE";
    for (var i = 0; i < searchListLength; i++) {
      if (i != searchListLength-1) {
        query = query + " CONCAT(' ',LOWER(quote_extended.quotetext),' ') SIMILAR TO LOWER('% " + searchList[i] + "_? %') " + andOr;
      }
      else {
        query = query + " CONCAT(' ',LOWER(quote_extended.quotetext),' ') SIMILAR TO LOWER('% " + searchList[i] + "_? %')";
      }
    }
    return db.any(('SELECT DISTINCT * FROM quote_extended' + query));
  } catch (err) {
    console.log(err);
  }
}

//Add category to quote
Quote.addCategoryToQuote = (quote_id, category_id) => {
  try {
    return db.query("INSERT INTO quote_category(quote_id, category_id) VALUES($1, $2)", [quote_id, category_id]);
  } catch (err) {
    console.log(err);
  }
}

//Remove category from quote
Quote.removeCategoryFromQuote = (quote_id, category_id) => {
  try {
    return db.query("DELETE FROM quote_category WHERE quote_id = $1 AND category_id = $2", [quote_id, category_id]);
  } catch (err) {
    console.log(err);
  }
}

//Check if quote is categorized
Quote.categorizedAs = (quote_id, category_id) => {
  try {
    return db.oneOrNone("SELECT * FROM quote_category WHERE quote_id = $1 AND category_id = $2 LIMIT 1", [quote_id, category_id]);
  } catch(err) {
    console.log(err);
  }
}

//Get quotes matching given category (not logged in)
Quote.getByCategory = (category_id) => {
  try {
    return db.any("SELECT DISTINCT quote_extended.* FROM quote_extended LEFT JOIN quote_category ON quote_extended.id = quote_category.quote_id LEFT JOIN category ON quote_category.category_id = category.id WHERE category.id = $1;", [category_id]);
  } catch (err) {
    console.log(err);
  }
}

Quote.categories = (quote_id) => {
  try {
    return db.any("SELECT * FROM quote_category WHERE quote_id = $1", quote_id);
  } catch (err) {
    console.log(err);
  }
}


export default Quote;
