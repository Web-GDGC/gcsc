import RaiseQuestModel from "../models/RaiseQuestModel.js";
import UserModel from "../models/userModel.js"
import fs from "fs";


//raise request

const raiseRequest = async (req, res) => {

    const {Subject, location, Description, no_volunter_required} = req.body;

    const RaiseQuest = new RaiseQuestModel({
        userId: req.userId,
        Subject: Subject,
        location: location,
        image: req.file.filename,
        Description: Description,
        no_volunter_required: no_volunter_required,
        Date: new Date()
    })
    try{
        await RaiseQuest.save()
        res.json({success:true, message:"Request Added successfully"})
    }catch(err){
        console.log(err)
        res.json({success:false, message:"Error"})
    }

}

//update request in the database

const UpdateRequest = async (req, res) => {

    const userId = req.userId;

    try {
        const data = await RaiseQuestModel.findOneAndUpdate({userId: userId}, {$set: {Status: "Request Completed!!"}});
        if(!data){
            res.json({success:false, message:"Kindly Refresh!"})
        }
        res.json({success:true, message: "Status Updated Successfully!"})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

const AcceptRequest = async (req, res) => {

    const userId = req.userId;
    const id = req.body.id;

    try {

        // 1. Check if already accepted
        const alreadyAccepted = await UserModel.exists({
            _id: userId,
            [`Accepted_request.${id}`]: { $exists: true }
        });

        if (alreadyAccepted) {
            return res.json({
                success: false,
                message: "You have already accepted this request"
            });
        }

        // 2. Check & decrease volunteer count atomically
        const request = await RaiseQuestModel.findOneAndUpdate(
            { _id: id, no_volunter_required: { $gt: 0 } },
            { $inc: { no_volunter_required: -1 } },
            { new: true }
        );

        if (!request) {
            return res.json({
                success: false,
                message: "You can't accept this request. No volunteers required."
            });
        }

        // 3. Add request id to user's Accepted_request object
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    [`Accepted_request.${id}`]: {
                        acceptedAt: new Date()
                    }
                }
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Request accepted successfully",
            remainingVolunteers: request.no_volunter_required,
            acceptedRequests: updatedUser.Accepted_request
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server error"
        });
    }

};

const GetAllRequest = async (req, res) => {

    const location = req.body.location;

    try {

        // build filter dynamically
        let filter = {};

        if (location && location.trim() !== "") {
            filter.location = { $regex: location, $options: "i" }; 
            // case-insensitive match
        }

        const requests = await RaiseQuestModel
            .find(filter)
            .sort({ Date: -1 });

        res.json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching requests"
        });

    }

};

const GetMyAcceptedRequests = async (req, res) => {

    const userId = req.userId;

    try {

        // 1. Get user's accepted requests object
        const user = await UserModel.findById(userId, "Accepted_request");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const acceptedRequestsObj = user.Accepted_request || {};

        // 2. convert object -> array of ids
        const requestIds = Object.keys(acceptedRequestsObj);

        if (requestIds.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        // 3. get full request details
        const requests = await RaiseQuestModel.find({
            _id: { $in: requestIds }
        });

        // 4. attach acceptedAt date & sort latest first
        const sortedRequests = requests
            .map(reqData => ({
                ...reqData._doc,
                acceptedAt: acceptedRequestsObj[reqData._id]?.acceptedAt
            }))
            .sort((a, b) => 
                new Date(b.acceptedAt) - new Date(a.acceptedAt)
            );

        res.json({
            success: true,
            count: sortedRequests.length,
            data: sortedRequests
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Error fetching accepted requests"
        });

    }

};

export {raiseRequest, UpdateRequest, AcceptRequest, GetAllRequest, GetMyAcceptedRequests}