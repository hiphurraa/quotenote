import express from 'express';
import { getAllQuotes,
         getQuote, 
         deleteQuote, 
         updateQuote, 
         createQuote, 
         getQuotesByUser, 
         getCarouselQuotes, 
         getMostRecentQuotes, 
         likeQuote, 
         favoriteQuote,
         getQuoteBySearch,
         getFavoritesByUser,
         categorizeQuote,
         getQuotesByCategory} 
         from "../controllers/quotesController.js";
import jwtAuth from '../authentication/jwtAuthentication.js';

const router = express.Router();

router.get('/', jwtAuth.addUser, getAllQuotes);
router.get('/recent', jwtAuth.addUser, getMostRecentQuotes);
router.get('/user/:id', jwtAuth.addUser, getQuotesByUser);
router.get('/carousel', jwtAuth.addUser, getCarouselQuotes);
router.get('/category/:id', jwtAuth.addUser, getQuotesByCategory);
router.get('/favorite', jwtAuth.checkAccessToken, getFavoritesByUser);
router.get('/:id', jwtAuth.addUser, getQuote);
router.delete('/:id', jwtAuth.checkAccessToken,deleteQuote);
router.put('/:id', jwtAuth.checkAccessToken, updateQuote);
router.post('/', jwtAuth.checkAccessToken, createQuote);
router.post('/search', jwtAuth.addUser, getQuoteBySearch);
router.post('/like/:id', jwtAuth.checkAccessToken, likeQuote);
router.post('/favorite/:id', jwtAuth.checkAccessToken, favoriteQuote);
router.post('/categorize/:id', jwtAuth.checkAccessToken, categorizeQuote);

export default router;
