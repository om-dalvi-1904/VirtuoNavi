import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import Home from './Home';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Admin from './components/Admin/Admin'; // Import your Admin component
import FrontPage from './components/FrontPage/FrontPage';


function App() {
  const [userDetails, setUserDetails] = useState(null); // State to store user details
  const [userDocId, setUserDocId] = useState(null); // State to store user document ID
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track user authentication

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        // You can fetch user details from Firebase and set it here
        // setUserDetails({ name: user.displayName, email: user.email });
      } else {
        setIsAuthenticated(false);
        setUserDetails(null);
        setUserDocId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <FrontPage />
      <Router>
      <Routes>
        {/* Redirect user to home if authenticated, otherwise show login */}
        <Route path="/login" element={!isAuthenticated ? <Login setUserDetails={setUserDetails} setUserDocId={setUserDocId} /> : <Navigate to="/home" />} />

        {/* Redirect to signup if user wants to sign up */}
        <Route path="/Signup" element={<Signup />} />

        {/* Home route, accessible only if user is authenticated */}
        <Route path="/home" element={isAuthenticated ? <Home userDetails={userDetails} userDocId={userDocId} /> : <Navigate to="/login" />} />

        {/* Admin route, accessible only if user is authenticated */}
        <Route path="/admin" element={isAuthenticated ? <Admin userDetails={userDetails} userDocId={userDocId} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
    </div>
    
  );
}

export default App;
