const mongoose = require('mongoose');
const uri = "mongodb+srv://transportUser:MWVpaba123@transport.frnj3bp.mongodb.net/transportDB?retryWrites=true&w=majority";

async function test() {
    try {
        await mongoose.connect(uri);
        const driverSchema = new mongoose.Schema({ name: String }, { strict: false });
        const Driver = mongoose.model('Driver', driverSchema);
        const docs = await Driver.find().limit(5);
        console.log("Found drivers:", docs.length);
        console.log("Documents:", JSON.stringify(docs, null, 2));
        mongoose.disconnect();
    } catch(err) {
        console.error("Failed:", err.message);
    }
}
test();
