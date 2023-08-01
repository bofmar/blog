import express from 'express';

import * as commentsControls from "../controllers/commentsControllers.js"
import passport from 'passport';

// TODO:
// Delete comment
// Update comment
// Increment comment likes
// Decrement comment likes

const route = express.Router();

route.get('/', commentsControls.allComments);

route.get('/:commentId', commentsControls.oneComment);

route.post('/', passport.authenticate('jwt', { session: false }), commentsControls.createComment);

route.delete('/:commentId', passport.authenticate('jwt', { session: false }), commentsControls.deleteComment);

export default route;
