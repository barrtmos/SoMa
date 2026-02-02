import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <Header />
            <main className="section container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
                    <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Профиль</h2>
                    <p className="section-subtitle" style={{ fontSize: '1.2rem' }}>Личный кабинет пользователя SoMa</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
