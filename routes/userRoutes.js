import express from "express"
import userAuth from './../middleware/authmiddleware.js';
import { usergetcontroller, userputcontroller } from './../controllers/userputcontroll.js';

const router = express.Router()

router.get("/get", userAuth, usergetcontroller)
router.put("/update", userAuth, userputcontroller);


export default router