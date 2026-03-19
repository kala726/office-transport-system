const axios = require('axios');
const url = 'https://office-transport-system.vercel.app/api/vehicles';
const payload = {
    registrationNo: "TEST-123",
    type: "Van",
    model: "Toyota",
    capacity: 14,
    driver: "W.P.G.Fonseka",
    fuelType: "Diesel",
    status: "Active"
};

async function test() {
    try {
        const res = await axios.post(url, payload);
        console.log("Success:", res.data);
    } catch (err) {
        console.error("Error from backend:", err.response ? err.response.data : err.message);
    }
}
test();
