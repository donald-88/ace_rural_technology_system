import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    if (mongoose.connections[0].readyState) {
        // Already connected
        return;
    }

    await mongoose.connect(process.env.MONGODB_URI!);
};
