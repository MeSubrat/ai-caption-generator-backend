import mongoose from "mongoose";
const mongoUri = process.env.MONGO_URI;
const connectDb = () => {
    try {
        mongoose.connect(mongoUri);
        console.log('Mongodb Connected.');
    } catch (error) {
        console.log('Error: ', error);
    }
}
export default connectDb;