import express from 'express';

import * as userControls from "../controllers/userControllers.js"

const route = express.Router();

// GET a list of all users
route.get('/', userControls.getAllUsers);

// SIGN-UP a new user
route.post('/sign-up', userControls.createUser);

export default route;
