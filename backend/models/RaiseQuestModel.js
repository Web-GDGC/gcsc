import mongoose from "mongoose";


const RaiseQuestSchema = new mongoose.Schema({
    userId: {type:String, required:true},
    Subject: {type:String, required:true},
    location: {type:String, required:true},
    image: {type:String, required:true},
    Description: {type:String, required:false},
    no_volunter_required: {type:Number},
    Status: {type:String, default:"Pending"},
    Date: {type:Date, required:true}
},{minimize: true})

const RaiseQuestModel = mongoose.models.RaiseQuest || mongoose.model("RaiseQuest", RaiseQuestSchema);

export default RaiseQuestModel;