import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    general: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    if (name === 'password' && value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (name === 'username' && value.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      general: '',
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
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      general: '',
    };

    if (newErrors.username || newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting registration with:', formData);
      await register(formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      console.error('Registration error details:', err.response?.data);
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response?.status === 400 && err.response?.data?.message?.includes('email')) {
        errorMessage = 'Email already exists';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      {errors.general && <p className="error">{errors.general}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {errors.username && (
            <span id="username-error" className="error">
              {errors.username}
            </span>
          )}
        </div>
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
            aria-describedby={errors.email ? 'email-error' : undefined}
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
            placeholder="Enter your password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <span id="password-error" className="error">
              {errors.password}
            </span>
          )}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="loader" aria-label="Loading"></span>
          ) : (
            'Register'
          )}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default RegisterPage;