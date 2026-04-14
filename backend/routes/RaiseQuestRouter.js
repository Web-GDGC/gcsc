import express from 'express';
import { raiseRequest, UpdateRequest, AcceptRequest, GetAllRequest, GetMyAcceptedRequests } from '../controllers/RaiseQuestControllers.js';
import multer from 'multer';
import authmiddleware from "../middleware/auth.js"


const RaiseQuestRouter = express.Router();

//Image store engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage});
//----------------------------------------------------------------

//add the image store to the api
RaiseQuestRouter.post("/RaiseRequest", authmiddleware, upload.single("image") ,raiseRequest)
RaiseQuestRouter.get("/updateRequest", authmiddleware, UpdateRequest)
RaiseQuestRouter.get("/acceptRequest", authmiddleware, AcceptRequest)
RaiseQuestRouter.get("/getAllRequest", authmiddleware, GetAllRequest)
RaiseQuestRouter.get("/getMyAcceptedRequests", authmiddleware, GetMyAcceptedRequests)




export default RaiseQuestRouter;