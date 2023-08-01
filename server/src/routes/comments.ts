import express from 'express';

import * as commentsControls from "../controllers/commentsControllers.js"

// TODO:
// Get all comments
// Get all by user
// Get one by id
// Post new comment
// Delete comment
// Update comment

const route = express.Router();

route.get('/', commentsControls.allComments);


export default route;
