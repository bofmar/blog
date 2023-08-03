import express from 'express';
import * as postControls from "../controllers/postsControllers.js"
import passport from 'passport';

const route = express.Router();

// Routes left
//
// get all posts sorted by likes
// publish post
// unpublish post
// edit post
// delete post

route.get('/', postControls.allPosts);

route.get('/:postId', postControls.onePost);

route.post('/', passport.authorize('jwt'), postControls.createPost);

export default route;
