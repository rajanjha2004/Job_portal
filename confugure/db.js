import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`Connection to DB ${mongoose.connection.host} is succeeded`);
    } catch (err) {
        console.log(err);
    }
};

export default connectdb;
