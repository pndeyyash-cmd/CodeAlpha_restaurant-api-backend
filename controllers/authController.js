const twilio = require('twilio');

// --- In-memory storage for OTPs (for this example) ---
// In a real production app, you might use a database like Redis for this.
const otpStore = {};

// --- Twilio Client Initialization ---
// It automatically finds the credentials in your .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const ADMIN_PHONE_NUMBER = "8874377426"; // Your phone number
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Load password from .env

// --- Controller to VERIFY PASSWORD ---
exports.verifyPassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  if (password === ADMIN_PASSWORD) {
    res.status(200).json({ message: 'Password verified successfully.' });
  } else {
    res.status(401).json({ message: 'Invalid password.' });
  }
};


// --- Controller to SEND OTP ---
exports.sendOtp = async (req, res) => {
  try {
    // 1. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 60000; // OTP expires in 60 seconds

    // 2. Store the OTP and its expiration time
    otpStore[ADMIN_PHONE_NUMBER] = { otp, expires };

    // 3. Send the OTP via Twilio SMS
    await twilioClient.messages.create({
      body: `Your verification code for Neha's Restaurant is: ${otp}`,
      from: twilioPhoneNumber,
      to: `+91${ADMIN_PHONE_NUMBER}` // IMPORTANT: Add country code for Twilio
    });
    console.log(`Successfully sent OTP ${otp} to ${ADMIN_PHONE_NUMBER}`);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error("Error sending Twilio SMS:", error);
    res.status(500).json({ message: 'Failed to send OTP.', error: error.message });
  }
};

// --- Controller to VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const storedOtpData = otpStore[ADMIN_PHONE_NUMBER];

  // 1. Check if OTP exists and is not expired
  if (!storedOtpData || storedOtpData.expires < Date.now()) {
    return res.status(400).json({ message: 'OTP has expired or does not exist. Please request a new one.' });
  }

  // 2. Check if the submitted OTP is correct
  if (storedOtpData.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }

  // 3. If correct, clear the OTP and send success response
  delete otpStore[ADMIN_PHONE_NUMBER];
  res.status(200).json({ message: 'Verification successful!' });
};
