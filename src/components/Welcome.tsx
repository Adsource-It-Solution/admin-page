import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Divider,
  Button,
  CircularProgress
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

export default function Welcome() {
  const navigate = useNavigate();

  // Toggle between Admin and Employee login
  const [isAdmin, setIsAdmin] = useState(true);

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) errors.email = "Email is required";
    else if (!emailRegex.test(form.email)) errors.email = "Invalid email format";

    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClickShowPassword = () => setShowPassword(prev => !prev);

  const submitLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const endpoint = isAdmin
        ? "/api/admin/admin-login"
        : "/api/service/employee-login";

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        form,
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      if (res.data.token) {
        localStorage.setItem(isAdmin ? "adminToken" : "employeeToken", res.data.token);
      }

      toast.success(res.data.message || "Login successful");
      navigate(isAdmin ? "/proposal" : "/employeepage");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetch("https://admin-backend-gh6c.onrender.com/api/health")
    .then(() => console.log("Render backend woken up"))
    .catch((err) => console.error("Failed to wake backend:", err));
}, []);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br to-indigo-900 relative overflow-hidden">

      {/* Background animation */}
      <motion.img
        src="/3334896.jpg"
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
          <motion.form
            key={isAdmin ? "admin" : "employee"}
            onSubmit={submitLogin}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
              {isAdmin ? "🔑 Admin Login" : "👷 Employee Login"}
            </h1>
            <Divider className="mb-4" />

            {/* Email */}
            <TextField
              required
              name="email"
              label={isAdmin ? "Admin Email" : "Employee Email"}
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "primary.main",
                fontSize: "1.1rem",
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: 2,
                "&:hover": { backgroundColor: "primary.dark" }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
            </Button>

            <div className="flex justify-between text-white mt-2 text-sm">
              <button
                type="button"
                className="underline"
                onClick={() => setIsAdmin(!isAdmin)}
              >
                {isAdmin ? "Employee Login →" : "Admin Login →"}
              </button>
              <span>{isAdmin ? "Use your Admin credentials" : "Use your Employee credentials"}</span>
            </div>
              {/* <Link to="/forget-password" className="text-blue-500">Forget Password? </Link> */}
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
