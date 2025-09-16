import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Divider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
    email: string;
    password: string;
  }
  
  interface FormErrors {
    email?: string;
    password?: string;
  }

export default function Home() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLoading] = useState(false);


  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);



  const submitLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        // `${import.meta.env.VITE_API_URL}/api/admin/admin-login`,
        "http://localhost:5000/api/admin/admin-login",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // ✅ Save token
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        console.log("✅ Admin token saved:", res.data.token);
      }

      toast.success(res.data.message || "Login successful");
      setTimeout(() => navigate("/service"), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br  to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <motion.img
        src="/animated-background.svg"
        alt="background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />


      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white/20 backdrop-blur-lg rounded-3xl shadow-lg px-6 sm:px-10 py-10 sm:py-16 flex flex-col gap-6"
      >
        <AnimatePresence mode="wait">
          {!showSignup ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                🙏🏻 Welcome
              </h1>
              <span className="text-lg sm:text-xl text-white">
                to <span className="font-bold">ArchVid</span>
              </span>
              <Divider />
              <button
                onClick={() => setShowSignup(true)}
                className="bg-blue-500/60 hover:bg-blue-600/70 transition text-xl sm:text-2xl font-semibold py-3 w-full sm:w-2/3 mx-auto text-white rounded-xl shadow-md"
              >
                Get Started
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="signup"
              onSubmit={submitLogin}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
          🔑 Admin Login
        </h1>
        <Divider className="mb-4" />

        {/* Email */}
        <TextField
          required
          name="email"
          label="Admin Email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          fullWidth
        />

        {/* Password */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            error={!!formErrors.password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {formErrors.password && (
            <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>
          )}
        </FormControl>

        <button
          type="submit"
          className="bg-blue-600/80 hover:bg-blue-700/90 transition text-xl font-semibold py-3 w-full text-white rounded-xl shadow-md"
        >
          Login
        </button>

              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="mt-2 text-white text-right hover:underline"
              >
                ⬅ Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
