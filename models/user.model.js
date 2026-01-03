import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        reuqired: true
    },
    email: {
        type: String,
        reuqired: true
    },
    password: {
        type: String,
        reuqired: true
    },
    avatar: {
        type: String,
    },
    plan: {
        type: String,
        default: 'FREE',
        enum:['FREE','PRO']
    },
    captions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CaptionModel'
        }
    ],
    favourites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CaptionModel'
        }
    ]
})

const UserModel = mongoose.model('UserModel', UserSchema);
export default UserModel;