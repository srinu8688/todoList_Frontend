import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { login as loginService } from "../../services/authService";
import "./LoginPage.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      general: "",
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      general: "",
    };

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginService(formData.email, formData.password);
      login(user);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {errors.general && <p className="error">{errors.general}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="error">
              {errors.email}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span id="password-error" className="error">
              {errors.password}
            </span>
          )}
        </div>
      
        <button type="submit" disabled={isLoading}>
  {isLoading ? <ClipLoader size={24} color="#ffffff" /> : "Login"}
</button>

      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;