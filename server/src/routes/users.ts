import express from 'express';

// TODO Missing Routes:
// log-in user
// log-out user

import * as userControls from "../controllers/userControllers.js"

const route = express.Router();

// GET a list of all users
route.get('/', userControls.getAllUsers);

// GET specific user
route.get('/:userId', userControls.getUser);

// SIGN-UP a new user
route.post('/sign-up', userControls.createUser);

export default route;
