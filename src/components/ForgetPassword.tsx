import { useState } from "react";
import axios from "axios";

export default function ForgetPassword() {
  const [method, setMethod] = useState<"old" | "otp">("old");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  const handleOldPasswordChange = async () => {
    await axios.post("/api/change-password", { email, oldPassword, newPassword });
    alert("Password changed successfully!");
  };

  const requestOtp = async () => {
    await axios.post("/api/request-otp", { email });
    setOtpRequested(true);
    alert("OTP sent to email");
  };

  const handleOtpReset = async () => {
    await axios.post("/api/reset-password-otp", { email, otp, newPassword });
    alert("Password changed successfully!");
  };

  return (
    <div>
      <h2>Forgot / Reset Password</h2>
      <div>
        <button onClick={() => setMethod("old")}>Use Old Password</button>
        <button onClick={() => setMethod("otp")}>Use Email OTP</button>
      </div>

      {method === "old" ? (
        <div>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Old Password" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
          <input placeholder="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <button onClick={handleOldPasswordChange}>Change Password</button>
        </div>
      ) : (
        <div>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          {!otpRequested ? (
            <button onClick={requestOtp}>Request OTP</button>
          ) : (
            <>
              <input placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} />
              <input placeholder="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <button onClick={handleOtpReset}>Reset Password</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
