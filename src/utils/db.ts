import mongoose from "mongoose";

const connectDB = async () => {
try {
    if(process.env.DB_URI){
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected successfully');
    }
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if we can't connect to the DB
}
};

export default connectDB;