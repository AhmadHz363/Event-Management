import React, { useState } from 'react';
import { useAuth } from "../../Contexts/AuthContext";
import { useLogin } from '../../Hooks/useLogin';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useAuth();
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { token, user } = response;
      setAuthData(token, user); 
      navigate("/dashboard");
    } catch {
      // error handled by useLogin already
    }
  };

  return (
    <div className="login-page d-flex min-vh-100 justify-content-center align-items-center bg-light">
      <div className="card border-0 shadow-sm p-4" style={{ 
        width: '100%', 
        maxWidth: '450px',
        borderRadius: '12px'
      }}>
        <div className="text-center mb-4">
          <div className="mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4E5ED6" strokeWidth="2"/>
              <path d="M12 16V12M12 8H12.01" stroke="#4E5ED6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="fw-bold mb-2" style={{ color: '#2D3748' }}>Welcome back</h2>
          <p className="text-muted">Sign in to continue to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium" style={{ color: '#4A5568' }}>Email address</label>
            <input
              type="email"
              className="form-control py-2"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="password" className="form-label fw-medium" style={{ color: '#4A5568' }}>Password</label>
          </div>
            <input
              type="password"
              className="form-control py-2"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: '8px', borderColor: '#E2E8F0' }}
            />
          </div>

          <div className="mb-4">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="rememberMe" 
                style={{ borderColor: '#E2E8F0' }}
              />
              <label className="form-check-label" htmlFor="rememberMe" style={{ color: '#4A5568' }}>
                Remember me
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 py-2 fw-medium"
            disabled={loading}
            style={{
              backgroundColor: '#4E5ED6',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3B4BC8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4E5ED6'}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

     
      </div>
    </div>
  );
};

export default LoginPage;