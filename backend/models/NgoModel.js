import mongoose from "mongoose";


const NgoModelSchema = new mongoose.Schema({
    Name: {type:String, required:true},
    location: {type:String, required:true},
    Description: {type:String, required:false},
    Status: {type:String, default:"Pending"},
    Phone: {type:Number, required:true}
},{minimize: true})

const NgoModel = mongoose.models.NgoRequest || mongoose.model("NgoRequest", NgoModelSchema);

export default NgoModel;