// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is blocked from localStorage
    const blockExpireTime = localStorage.getItem('blockExpireTime');
    if (blockExpireTime) {
      const now = new Date().getTime();
      if (now < blockExpireTime) {
        setIsBlocked(true);
        const timeout = blockExpireTime - now;
        // Unblock the user after the timeout
        setTimeout(() => {
          setIsBlocked(false);
          localStorage.removeItem('blockExpireTime');
          setAttempts(0);
        }, timeout);
      } else {
        // Block time expired
        localStorage.removeItem('blockExpireTime');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      setErrorMessage(
        'You have been blocked for 1 hour after 5 failed attempts. Please try again later.',
      );
      return;
    }

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
      setAttempts((prev) => prev + 1);

      if (attempts + 1 >= 5) {
        const blockTime = new Date().getTime() + 60 * 60 * 1000; // Block for 1 hour
        localStorage.setItem('blockExpireTime', blockTime);
        setIsBlocked(true);
        setErrorMessage(
          'You have been blocked for 1 hour after 5 failed attempts. Please try again later.',
        );
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-sky-50 to-blue-50 flex items-start justify-center pt-12">
      {/* 로그인 카드 */}
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
              disabled={isBlocked}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
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
              disabled={isBlocked}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600 transition"
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isBlocked}
            className={`w-full flex items-center justify-center px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors ${
              isBlocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Login
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>
        {/* 푸터 아이콘 */}
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
