import express from 'express';

import * as commentsControls from "../controllers/commentsControllers.js"
import passport from 'passport';

const route = express.Router();

route.get('/', commentsControls.allComments);

route.get('/:commentId', commentsControls.oneComment);

route.post('/', passport.authenticate('jwt', { session: false }), commentsControls.createComment);

route.delete('/:commentId', passport.authenticate('jwt', { session: false }), commentsControls.deleteComment);

route.put('/:commentId', passport.authenticate('jwt', { session: false }), commentsControls.updateComment);

export default route;
