import express from 'express';
import jwtAuth from '../authentication/jwtAuthentication.js';
import { createComment, deleteComment, getByQuote, updateComment, likeComment } from "../controllers/commentController.js";

const router = express.Router();

router.get("/quote/:id", jwtAuth.addUser, getByQuote);
router.post("/", jwtAuth.checkAccessToken, createComment);
router.put("/:id", jwtAuth.checkAccessToken, updateComment);
router.delete("/:id", jwtAuth.checkAccessToken, deleteComment);
router.post('/like/:id', jwtAuth.checkAccessToken, likeComment);



export default router;