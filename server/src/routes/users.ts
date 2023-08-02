import express from 'express';

import * as userControls from "../controllers/userControllers.js"

const route = express.Router();

// GET a list of all users
route.get('/', userControls.getAllUsers);

// GET specific user
route.get('/:userId', userControls.getUser);

// SIGN-UP a new user
route.post('/sign-up', userControls.createUser);

// LOG-IN user
route.post('/log-in', userControls.loginUser);

// LOG-IN admin only
route.post('/admin-log-in', userControls.loginAdmin);
export default route;
