const mongoose = require('mongoose');

// Disable Mongoose global buffering
mongoose.set('bufferCommands', false);

// Global cache for serverless environments
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('🔄 Initiating new MongoDB Connection...');
        const opts = {
            serverSelectionTimeoutMS: 5000,
        };
        
        // Prevent immediate crash if URI is missing
        if (!process.env.MONGODB_URI) {
            console.error("❌ MONGODB_URI is missing in Environment Variables");
            return null;
        }

        // Clean up URI globally (Vercel sometimes mangles it with trailing or scattered literal quotes)
        const cleanURI = process.env.MONGODB_URI.replace(/["']/g, '');

        cached.promise = mongoose.connect(cleanURI, opts).then(async (mongoose) => {
            console.log('✅ New MongoDB Connection Established!');
            try {
                // Drop the problematic unique index on licenseNo if it exists from legacy schemas
                await mongoose.connection.collection('drivers').dropIndex('licenseNo_1');
                console.log('✅ Dropped legacy licenseNo unique index');
            } catch (e) {
                // Index might not exist, which is fine
            }
            return mongoose;
        }).catch((err) => {
            console.error("❌ MongoDB Connection Error:", err.message);
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        return null;
    }
};

module.exports = connectDB;