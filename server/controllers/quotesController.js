import isEmpty from "is-empty";
import Quote from "../models/quotesModel.js";
import { validateQuoteData } from "../validation/quotes.js";
import { validateQuoteLike } from "../validation/like.js";
import User from '../models/userModel.js';

//Get all quotes from database
export const getAllQuotes = async (req, res) => {
  if(req.user){
    try{
      const quotes = await Quote.getAllLoggedIn(req.user.id);
      return res.status(200).json({ title:'Retrieved all quotes', data: quotes});
    }catch(err) { console.log(err); return res.status(500).json(err); }
  }
  
  try {
    const quotes = await Quote.getAll();
    res.status(200).json({ title: 'Retrieved all quotes', data: quotes});
  } catch (error) { console.log(err); return res.status(500).json(err); }

};

//Get a quote by quote id
export const getQuote = async (req, res) => {
  const quoteId = req.params.id;
  
  if(req.user){
    try{
      const quote = await Quote.getByQuoteIdLoggedIn(quoteId, req.user.id);
      return res.status(200).json({ title:'Retrieved quote', data: quote});
    }catch(err) { console.log(err); return res.status(500).json(err); }
  }

  try {
    const quote = await Quote.getByQuoteId(quoteId);
    res.status(200).json({ title:'Retrieved quote', data: quote});
  } catch (err) { console.log(err); return res.status(500).json(err); }
  
};

//Get a quote by user id
export const getQuotesByUser = async (req, res) => {
  const userId = req.params.id;
  if(req.user){
    try {
      const quotes = await Quote.getByUserIdLoggedIn(userId, req.user.id);
      return res.status(200).json({ title: 'Retrieved users all quotes', data: quotes });
    } catch (err) { console.log(err); return res.status(500).json(err); }
  }
  
  try {
    const quotes = await Quote.getByUserId(userId);
    res.status(200).json({ title: 'Retrieved users all quotes', data: quotes });    
  } catch (err) { console.log(err); return res.status(500).json(err); }

};

//Get quotes for the carousel
export const getCarouselQuotes = async (req, res) => {
  if(req.user){
    try{
      const quotes = await Quote.getCarouselLoggedIn(req.user.id);
      return res.status(200).json({title: "Retrieved the quotes for the carousel", data: quotes});  
    }catch(err){console.log(err); return res.status(500).json({"error": "Unexpected error!"})}
  }

  try{
    const quotes = await Quote.getCarousel();
    return res.status(200).json({title:  "Retrieved the quotes for the carousel", data: quotes});
  }catch(err){console.log(err); return res.status(500).json({"error": "Unexpected error!"})}
};

//Get quotes that are most recently posted
export const getMostRecentQuotes = async (req, res) => {
  if (req.user){
    try{
      const quotes = await Quote.getMostRecentLoggedIn(req.user.id);
      return res.status(200).json({title: "Retrieved the most recent quotes", data: quotes});
    }catch(err){ console.log(err); return res.status(500).json({"error": "Unexpected error!"});}
  }

  try{
    const quotes = await Quote.getMostRecent();
    return res.status(200).json({title: "Retrieved the most recent quotes", data: quotes});
  }catch(err){ console.log(err); return res.status(500).json({"error": "Unexpected error!"});}
}

//Delete quote by id
export const deleteQuote = async (req, res) => {
  const quoteId = req.params.id;
  const userId = req.user.id;
  const result = await User.getRoles(userId);
  const roles = result.map((role) => role.name);
  const quoteOwner = await Quote.getByQuoteId(quoteId);

  //If no owner, theres no quote
  if(!quoteOwner) return res.status(404).json({ title: "Quote not found" });


  if(roles.includes("admin") || roles.includes("moderator") || quoteOwner.user_id == userId){
    //Delete quote
    Quote.delete(quoteId)
      .then((data) => {
        if (data) res.status(200).json({ title: "Deleted quote", data });
        else res.status(400).json({ title: "No quote found" });
      })
      .catch((err) => res.status(500).json(err));
  }else{
    res.status(401).json({title: "Unauthorized"});
  }

};

//Update quote by quote id
export const updateQuote = async (req, res) => {
  if (!req.body.quote)
    return res.status(400).json({ title: "Missing quote data" });

  //Validate request data
  const { errors, isValid } = validateQuoteData(req.body.quote);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const quoteId = req.params.id;
  const userId = req.user.id;
  const newQuote = req.body.quote;
  const { categories } = newQuote;
  const oldCategories = await (await Quote.categories(quoteId)).map(category => category.category_id);
  //TODO: get categories and quoteOwner with one query from db

  // Check if user is the same user who created the quote
  const oldQuote = await Quote.getByQuoteId(quoteId);
  if (oldQuote.user_id !== userId)
    res.status(401).json({title: "Unauthorized"});

  // Everything ok, update quote
  Quote.update(quoteId, newQuote)
    .then(async (data) => {
      if (data) {
        //Currently we might succeed in updating other info than categories, but it's not a critical failure
        // (need to look into creating a transaction or single query for updating)
        updateCategories(oldCategories, categories, quoteId); //Don't wait for this to finish, as were not using result for anything, might need await here though
        res.status(200).json({ title: "Updated quote", data });
      }
      else res.status(400).json({ title: "No quote found" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "Server error! Please try again later."});
    });
};

//Create a new quote
export const createQuote = async (req, res) => {
  if (!req.body.data)
    return res.status(400).json({ title: "Missing quote data" });

  //Validate request data
  const { errors, isValid } = validateQuoteData(req.body.data);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const quoteData = req.body.data;
  const { categories } = quoteData;
  //console.log(typeof categories !== 'undefined');
  var category;
  quoteData.user_id = req.user.id; //gets set when checking jwt

  Quote.create(quoteData)
    .then((data) => {
      if (data) {res.status(200).json({ title: "Quote created.", id: data.id });
      if (typeof categories !== 'undefined' && categories.length != 0) {
        for (category of categories) {
          var cat = parseInt(category);
          Quote.addCategoryToQuote(data.id, cat);
        }
      }
      }
      else
        res
          .status(500)
          .json({ title: "Server error, please try again later." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ title: "Server error, please try again later." });
    });
    
};

//Liking a quote
export const likeQuote = async (req, res) => {
  const user_id = req.user.id;
  const quote_id = req.params.id;

  //Validate request
  const { errors, isValid } = await validateQuoteLike(quote_id, user_id);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const likeStatus = req.body.likeStatus;
  const is_negative = (likeStatus === -1) ? true : false;
  const liked = await Quote.likedBy(user_id, quote_id);

  // 1.) There is an entry for the quote/user already
  if (liked) {
    // likeStatus: 0 --> remove entry from database
    if (likeStatus === 0) {
      Quote.removeLike(quote_id, user_id)
        .then(async() => {
          const quote = await Quote.getByQuoteIdLoggedIn(quote_id, user_id);
          res.status(200).json({ title: "Removed previous like/dislike", quote });
        })
        .catch(err => { console.log(err); return res.status(500).json({ title: "Error updating database" }) });
    } 

    //Wanted status same as in database --> No action needed
    else if (is_negative === liked.is_negative) { 
      const quote = await Quote.getByQuoteIdLoggedIn(quote_id, user_id);
      res.status(200).json({ title: "Requested status is the same as in database", quote });
    } 

    // Otherwise change is_negative value in database
    else { 
      Quote.flipLike(quote_id, user_id, is_negative)
        .then(async () => {
          const quote = await Quote.getByQuoteIdLoggedIn(quote_id, user_id);
          res.status(200).json({ title: "Like status changed", quote })
        })
        .catch(err => { console.log(err); res.status(500).json({ title: "Error updating database" }); });
    }
  } 

  // 2.) There is no previous entry
  else { 
    // Same as was before, no change needed
    if (likeStatus === 0){
      const quote = await Quote.getByQuoteIdLoggedIn(quote_id, user_id);
      return res.status(200).json({ title: "No like/dislike on quote", quote });
    }

    //User hasn't liked or disliked before, so create a like
    Quote.newLike(quote_id, user_id, is_negative)
      .then(async() => {
        const quote = await Quote.getByQuoteIdLoggedIn(quote_id, user_id);
        res.status(200).json({ title: "Like/dislike added", quote })
      })
      .catch(err => { console.log(err); res.status(500).json({ message: "Error updating database" }) })
  }
}

//Get favorites of user
export const getFavoritesByUser = async (req, res) => {
  const user_id = req.user.id;
  Quote.getFavorites(user_id)
  .then((quotes) => res.status(200).json({title: "Retrieved favorites", quotes}))
  .catch((err) => {console.log(err); res.status(500).json(err);});
}


//Favorite/unfavorite a quote
export const favoriteQuote = async (req, res) => {
  const userId = req.user.id;
  const quoteId = req.params.id;
  const favorited = await Quote.favoritedBy(quoteId, userId);

  if (favorited) {
    Quote.removeFavorite(quoteId, userId)
      .then(async() => {
        const quote = await Quote.getByQuoteIdLoggedIn(quoteId, userId);
        res.status(200).json({ title: "Previous favorite removed", quote });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
  else {
    Quote.favorite(quoteId, userId)
      .then(async() => {
        const quote = await Quote.getByQuoteIdLoggedIn(quoteId, userId);
        res.status(200).json({ title: "Favorited a quote", quote });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
}

//Get quotes by search
export const getQuoteBySearch = async (req, res) => {
  const search = req.body.searchString;

  if (!search.replace(/\s/g, '').length) {
    var data = [];
    res.status(200).json({title: "Empty search string", data});
    return;
  }
  if (req.user) {
    //const andData = await Quote.getBySearchLoggedIn(search, req.user.id, "AND");
    //console.log(andData.length);
    if (true) { //data could be found with AND; andData.length != 0
      Quote.getBySearchLoggedIn(search, req.user.id, "AND")
      .then((data) => res.status(200).json({ title: "Retrieved quotes matching search criteria (logged in)", data }))
      .catch((err) => {
      console.log(err);
      res.status(500).json(err);
      });
    }
    else { //data could not be found with AND, let's try OR
      Quote.getBySearchLoggedIn(search, req.user.id, "OR")
      .then((data) => res.status(200).json({ title: "Retrieved quotes matching search criteria (logged in)", data }))
      .catch((err) => {
      console.log(err);
      res.status(500).json(err);
      });
    }
  }
  else {
    //const andData = await Quote.getBySearch(search, "AND");
    //console.log(andData.length);
    if (true) { //data could be found with AND; andData.length != 0
      Quote.getBySearch(search, "AND")
      .then((data) => res.status(200).json({ title: "Retrieved quotes matching search criteria (not logged in)", data }))
      .catch((err) => {
      console.log(err);
      res.status(500).json(err);
      });
    }
    else { //data could not be found with AND, let's try OR
      Quote.getBySearch(search, "OR")
      .then((data) => res.status(200).json({ title: "Retrieved quotes matching search criteria (not logged in)", data }))
      .catch((err) => {
      console.log(err);
      res.status(500).json(err);
      });
    }
  }
}

//Categorize a quote
export const categorizeQuote = async (req, res) => {
  const quote_id = req.params.id;
  const category_id = req.body.category_id;
  const isCategorized = await Quote.categorizedAs(quote_id, category_id);

  if (isCategorized) {
    Quote.removeCategoryFromQuote(quote_id, category_id)
    .then(() => res.status(200).json({title: "Removed category from quote", categorizedStatus: 0}))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  }
  else {
    Quote.addCategoryToQuote(quote_id, category_id)
    .then(() => res.status(200).json({title: "Added category to quote", categorizedStatus: 1}))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  }
}

//Get quotes by category
export const getQuotesByCategory = async(req, res) => {
  const category_id = req.params.id;
  if (req.user) {
    Quote.getByCategoryLoggedIn(req.user.id, category_id)
    .then((data) => res.status(200).json({title: "Retrieved quotes by category", data}))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  }
  else {
    Quote.getByCategory(category_id)
    .then((data) => res.status(200).json({title: "Retrieved quotes by category", data}))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  }
}

//Update categories. Loop through all categories, and remove or add when necessary
const updateCategories = async (oldCategories, newCategories, quoteId) => {
  //Not the best solution to just loop through 1-8 (current categories), but it works for now
  //Maybe add query to get all categories, and just loop through those instead
  for (let category = 1; category < 9; category++) {
    //No change needed, if it categorys status is same before and after update
    if(oldCategories.includes(category) && newCategories.includes(category)){
      continue;
      //If category is in old categories, but not in new, remove it
    } else if (oldCategories.includes(category) && !newCategories.includes(category)){
      await Quote.removeCategoryFromQuote(quoteId, category);
      //If category isn't in old categories, but is in new, add it
    }else if(!oldCategories.includes(category) && newCategories.includes(category)){
      await Quote.addCategoryToQuote(quoteId, category);
    }
  }
}