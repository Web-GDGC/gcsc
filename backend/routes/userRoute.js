//this code serve to user authentication system

import express from 'express'
import { loginUser, registerUser } from '../controllers/userControllers.js'
import multer from 'multer';

const userRouter = express.Router();

//Image store engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage: storage});


//on request /register serve registerUser function
userRouter.post('/register', upload.single("Id_Proof"), registerUser);
//on request /login serve loginUser function
userRouter.post('/login', loginUser);


export default userRouter;