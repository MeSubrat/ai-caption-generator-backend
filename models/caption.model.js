import mongoose from "mongoose";

const CaptionSchema = new mongoose.Schema({
    captionText: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel'
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    }
}, { timestamps: true })


const CaptionModel = mongoose.model('CaptionModel', CaptionSchema);

export default CaptionModel;
