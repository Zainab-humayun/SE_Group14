import { Router, Response, Request } from "express";
import prisma from "../db/prisma.js";
import verify from "../middleware/protectRoute.js";
import { getUserProfile, getComplains, getSearchedUserResults, getTrendingUsers, createComplain, submitUserRating } from "../controllers/generalControllers.js";


const router = Router();


router.post("/create-complain", verify, createComplain);
router.get("/get-complains", verify, getComplains);
router.get("/profile/:userId", verify, getUserProfile);
router.post("/search-users", verify, getSearchedUserResults);
router.get("/trending-users", verify, getTrendingUsers);
router.post("/rate-user", verify, submitUserRating);



export default router;


