import express from 'express';
import * as postControls from "../controllers/postsControllers.js"
import passport from 'passport';

const route = express.Router();


route.post('/', passport.authorize('jwt'), postControls.createPost);


export default route;
