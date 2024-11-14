// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isBlocked, setIsBlocked] = useState(false); // Manage block state
  const [blockType, setBlockType] = useState(null); // Manage block type
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_AUTH_BACKEND_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        },
      );

      if (response.status === 429) {
        // Handle rate limit response
        const data = await response.json();
        setErrorMessage(data.message); // Display message sent from server
        setIsBlocked(true);
        setBlockType(data.blockType);

        // Clear input fields
        setUsername('');
        setPassword('');

        // Set unblock timer after checking Retry-After header
        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
          const timeout = parseInt(retryAfter, 10) * 1000; // Convert seconds to milliseconds
          setTimeout(() => {
            setIsBlocked(false);
            setBlockType(null);
            setErrorMessage('');
          }, timeout);
        }
        return;
      }

      if (!response.ok) {
        throw new Error('Invalid username or password.');
      }

      const data = await response.json();
      setToken(data.token);
      navigate('/');
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-sky-50 to-blue-50 flex items-start justify-center pt-12">
      {/* Login Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg z-10">
        <h1 className="text-3xl font-extrabold text-sky-600 mb-6 text-center">
          TowerEye AI™ Login
        </h1>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-slate-800 font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // Disable input if IP blocked, enable if user blocked
              disabled={isBlocked && blockType === 'IP'}
              className={`w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none transition ${
                isBlocked && blockType === 'IP'
                  ? 'bg-gray-200 cursor-not-allowed opacity-50'
                  : 'focus:ring-2 focus:ring-sky-600'
              }`}
              required
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-slate-800 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Disable input if IP blocked, enable if user blocked
              disabled={isBlocked && blockType === 'IP'}
              className={`w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none transition ${
                isBlocked && blockType === 'IP'
                  ? 'bg-gray-200 cursor-not-allowed opacity-50'
                  : 'focus:ring-2 focus:ring-sky-600'
              }`}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            // Disable button if IP blocked, enable if user blocked
            disabled={isBlocked && blockType === 'IP'}
            className={`w-full flex items-center justify-center px-4 py-2 font-semibold text-white bg-sky-600 rounded-md transition-colors ${
              isBlocked && blockType === 'IP'
                ? 'opacity-50 cursor-not-allowed bg-gray-400'
                : 'hover:bg-sky-700'
            }`}
          >
            Login
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>
        {/* Footer Icon */}
        <div className="mt-6 flex items-center justify-center">
          <span className="text-slate-600 mr-2">Visit us on</span>
          <a href="https://cviss.net" target="_blank" rel="noopener noreferrer">
            <img src="/icons/cviss.jpeg" alt="CViSS" className="w-10 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
