// import mongoose from 'mongoose';

// let isconnected = false; // variable to track the connected status

// export const connectToDB = async () => {
//     mongoose.set('strictQuery', true);

//     if(!process.env.MONGODB_URI) return console.log('MONGODB_URI is not defined');

//     if(isconnected) return console.log('=> using existing database connection');

//     try {
//         await mongoose.connect(process.env.MONGODB_URI)

//         isconnected =true;

//         console.log('MongoDB connected')
      
        
//     } catch (error) {
//       console.log(error)  
        
//     }
// }
import mongoose, { connection } from 'mongoose';

// Initially, we're not connected to the database
let isConnected = false;

export const connectToDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    // If already connected, no need to connect again
    if (isConnected) {
        console.log('Using existing database connection');
        connection.setMaxListeners(20);
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true; // Update our connected status
        console.log('MongoDB connected successfully');
        // Listen to connection events for more robust handling
        mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
        mongoose.connection.on('disconnected', () => isConnected = false);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error; // Rethrow or handle as needed
    }
};