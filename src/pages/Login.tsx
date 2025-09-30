import { useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const errors: typeof formErrors = {};
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password.trim()) errors.password = "Password is required";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/service/employee-login`,
        // "http://localhost:5000/api/service/employee-login",
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormErrors({ email: data.error || "Login failed" });
        toast.error(data.error || "Login failed");
        return;
      }

      // Store JWT + employee info
      localStorage.setItem("token", data.token);
      localStorage.setItem("employee", JSON.stringify(data.employee));

      toast.success("✅ Login successful!");
      navigate("/employeepage");
    } catch (err) {
      console.error("Login error:", err);
      setFormErrors({ email: "Server error. Try again later." });
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-indigo-900 to-purple-700 relative overflow-hidden">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/20 p-6 rounded-xl shadow-lg flex flex-col gap-4 backdrop-blur-md"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-black text-center mb-4">
          🔑 Employee Login
        </h1>
        <Divider className="mb-6" />

        {/* Email */}
        <TextField
          name="email"
          label="Employee Email"
          variant="outlined"
          value={form.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          fullWidth
          className="bg-white rounded"
        />

        {/* Password */}
        <FormControl fullWidth variant="outlined" className="bg-white rounded">
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
        </FormControl>
        {formErrors.password && (
          <p className="text-red-600 text-sm mb-3">{formErrors.password}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="py-2 font-bold"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Link to="/" className="mt-2 text-white text-right">
          ⬅ Back
        </Link>
        <p>Admin can Update Password </p>
      </motion.form>
    </div>
  );
}

export default Login;
