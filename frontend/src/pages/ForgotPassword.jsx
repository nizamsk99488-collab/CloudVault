import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://cloudvault-1cuo.onrender.com";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        { email }
      );

      alert(res.data.message);
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Password Reset Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        {!otpSent ? (
          <form onSubmit={handleSendOTP}>

            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full p-3 border rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
            >
              Send OTP
            </button>

          </form>
        ) : (
          <form onSubmit={handleResetPassword}>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full p-3 border rounded-lg mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 border rounded-lg mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
            >
              Reset Password
            </button>

          </form>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full text-blue-600 hover:underline mt-5"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;