import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './webpages/WelcomePage';
import SignupPage from './webpages/SignupPage';
import HomePage from './webpages/HomePage';
import AccountSettingsPage from './webpages/AccountSettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />  
        <Route path="/settings" element={<AccountSettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
