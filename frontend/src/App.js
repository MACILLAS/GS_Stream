import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Index from './components/Main/Index';
import SingleView from './components/View/SSR/Single/SingleView';
import DualView from './components/View/SSR/Dual/DualView';
import CsrSingleView from './components/View/CSR/Single/CsrSingleView';
import CsrDualView from './components/View/CSR/Dual/CsrDualView';
import Login from './components/Login/Login';
import Landing from './components/Main/Landing';
import Landing2 from './components/Main/Landing2';
import RenderingPage from './components/View/CSR/Combine/Render';

function App() {
  const [token, setToken] = useState(null);
  const requireAuth = process.env.REACT_APP_REQUIRE_AUTH === 'true';
  console.log('Require Auth:', requireAuth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/"
          element={
            requireAuth && !token ? <Navigate to="/login" /> : <Landing />
          }
        />
        <Route path="/landing1" element={<Landing />} />
        <Route path="/landing2" element={<Landing2 />} />
        <Route path="/render" element={<RenderingPage />} />
        <Route
          path="/dual-view"
          element={
            requireAuth && !token ? <Navigate to="/login" /> : <DualView />
          }
        />
        <Route
          path="/single-view"
          element={
            requireAuth && !token ? <Navigate to="/login" /> : <SingleView />
          }
        />
        <Route
          path="/webgl/single-view"
          element={
            requireAuth && !token ? <Navigate to="/login" /> : <CsrSingleView />
          }
        />
        <Route
          path="/webgl/dual-view"
          element={
            requireAuth && !token ? <Navigate to="/login" /> : <CsrDualView />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
