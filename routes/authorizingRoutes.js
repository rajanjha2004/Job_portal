import express from "express"
import { loginpostcontroller, registerpostcontroller } from '../controllers/authroutescontroll.js';

const route = express.Router();

route.post("/register", registerpostcontroller);
route.post("/login", loginpostcontroller);

export default route;