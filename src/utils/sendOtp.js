// utils/sendOtp.js
const twilio = require("twilio");

const sendOtp = async (mobile, otp) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio SID
    const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Twilio Auth Token
    const client = new twilio(accountSid, authToken);

    const message = `Your OTP code is: ${otp}`;

    try {
        const response = await client.messages.create({
            body: message,
            to: mobile,  // Mobile number receiving OTP
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        });
        console.log('OTP sent successfully:', response);
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error('Error sending OTP');  // You can handle this in your controller
    }
};

module.exports = sendOtp;
