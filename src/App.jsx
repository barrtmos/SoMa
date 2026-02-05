import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import DiscoveryPage from './pages/DiscoveryPage';


const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<DiscoveryPage />} />
                    <Route path="/about" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/edit" element={<ProfileEditPage />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;
