import express from "express"
import { testget, testpost } from '../controllers/controller.js';
import userAuth from './../middleware/authmiddleware.js';
const route = express.Router();

route.get("/", testget)

route.post("/", userAuth, testpost);
export default route;