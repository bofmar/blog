import express from 'express';
import * as postControls from "../controllers/postsControllers.js"
import passport from 'passport';

const route = express.Router();

// Routes left
//
// edit post
// delete post

route.get('/', postControls.allPosts);

route.get('/byLikes', postControls.postsByLikes);

route.get('/:postId', postControls.onePost);

route.post('/', passport.authorize('jwt'), postControls.createPost);

route.put('/publish/:postId', passport.authorize('jwt'), postControls.changePublishStatus);

route.put('/:postId', passport.authorize('jwt'), postControls.updatePost);

export default route;
