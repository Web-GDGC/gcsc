import express from 'express';
import { NgoDetail } from '../controllers/NgoDetailController.js';


const NgoDetailRouter = express.Router();

//add the image store to the api
NgoDetailRouter.get("/getNgoDetail", NgoDetail)




export default NgoDetailRouter;