import express from 'express';

import * as commentsControls from "../controllers/commentsControllers.js"

// TODO:
// Get all by user
// Post new comment
// Delete comment
// Update comment

const route = express.Router();

route.get('/', commentsControls.allComments);

route.get('/:commentId', commentsControls.oneComment);


export default route;
