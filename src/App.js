import React from 'react';
import FrontPage from './components/FrontPage/FrontPage';

function App() {
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
