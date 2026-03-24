import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../Style/style.css";
import "../Style/Account.css";

const MyAccount = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoginChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setLoginData({ ...loginData, [e.target.name]: value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/api/auth/login', loginData);
      if (response.data.success) {
        setMessage('Login successful!');
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.data.token);
        setLoginData({ email: '', password: '' });
        if (user?.role === 'admin') navigate('/admin');
        else navigate('/');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/api/auth/register', signupData);
      if (response.data.success) {
        setMessage('Signup successful! You can now log in.');
        setSignupData({ name: '', email: '', password: '', role: 'user' });
        setIsLoginView(true);
      } else {
        setMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = (view) => {
    setIsLoginView(view);
    setMessage('');
  };

  return (
    <div>
      {/* Site Banner */}
      <div id="site-banner" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)" }}>
        <div className="banner-content">
          <h1>My Account</h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><a href="/" title="Home">Home</a></li>
            <li>&gt;</li>
            <li className="breadcrumb-item active"><span>My Account</span></li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-account-page">
        <div className="container">

          <div className="account-card">
            {/* Card Header */}
            <div className="account-card-header">
              <div className="account-avatar">
                <i className="fa fa-user"></i>
              </div>
              <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLoginView ? 'Sign in to your TourPress account' : 'Join TourPress and start exploring'}</p>
            </div>

            {/* Tab Toggle */}
            <div className="account-tab-toggle">
              <button
                className={`account-tab-btn ${isLoginView ? 'active' : ''}`}
                onClick={() => switchView(true)}
              >
                Login
              </button>
              <button
                className={`account-tab-btn ${!isLoginView ? 'active' : ''}`}
                onClick={() => switchView(false)}
              >
                Sign Up
              </button>
            </div>

            <div className="account-form-body">
              {/* Alert Message */}
              {message && (
                <div className={`account-alert ${message.includes('successful') ? 'success' : 'error'}`}>
                  <i className={`fa ${message.includes('successful') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  {message}
                </div>
              )}

              {/* Login Form */}
              {isLoginView ? (
                <form onSubmit={handleLoginSubmit}>
                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="account-input"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="password">
                      Password <span className="required">*</span>
                    </label>
                    <div className="account-password-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        className="account-input"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                      <button
                        type="button"
                        className="account-pw-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>

                  <div className="account-checkbox-row">
                    <input
                      type="checkbox"
                      id="rememberme"
                      name="rememberMe"
                      className="account-checkbox"
                      checked={loginData.rememberMe}
                      onChange={handleLoginChange}
                    />
                    <label htmlFor="rememberme" className="account-checkbox-label">Remember me</label>
                  </div>

                  <button type="submit" className="account-submit-btn" disabled={isLoading}>
                    {isLoading ? <><i className="fa fa-spinner fa-spin me-2"></i>Logging in...</> : 'Log In'}
                  </button>

                  <div className="account-footer-links">
                    <a href="#">Lost your password?</a>
                    <p>Don't have an account? <a onClick={() => switchView(false)}>Sign Up</a></p>
                  </div>
                </form>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleSignupSubmit}>
                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="name">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="account-input"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>

                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="reg_email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="reg_email"
                      name="email"
                      className="account-input"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>

                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="reg_password">
                      Password <span className="required">*</span>
                    </label>
                    <div className="account-password-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="reg_password"
                        name="password"
                        className="account-input"
                        placeholder="Create a strong password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        required
                      />
                      <button
                        type="button"
                        className="account-pw-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>

                  <div className="account-form-group">
                    <label className="account-form-label" htmlFor="role">
                      Role <span className="required">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      className="account-input"
                      value={signupData.role}
                      onChange={handleSignupChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button type="submit" className="account-submit-btn" disabled={isLoading}>
                    {isLoading ? <><i className="fa fa-spinner fa-spin me-2"></i>Signing up...</> : 'Create Account'}
                  </button>

                  <div className="account-footer-links">
                    <p>Already have an account? <a onClick={() => switchView(true)}>Log In</a></p>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyAccount;
