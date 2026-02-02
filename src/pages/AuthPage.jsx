import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(`Ошибка: ${error.message}`);
        } else {
            setMessage('Успешный вход!');
            navigate('/profile');
        }
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(`Ошибка: ${error.message}`);
        } else {
            setMessage('Регистрация успешна! Проверьте почту для подтверждения.');
            navigate('/profile');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <Header />
            <main className="section container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                    <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Вход в SoMa</h2>

                    <form className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />

                        {message && <p style={{ color: message.startsWith('Ошибка') ? '#ff4d4d' : '#4dff4d', marginBottom: '1rem' }}>{message}</p>}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn-primary"
                                onClick={handleLogin}
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? '...' : 'Войти'}
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={handleSignUp}
                                disabled={loading}
                                style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.8rem 1.5rem', borderRadius: '50px', cursor: 'pointer' }}
                            >
                                Регистрация
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AuthPage;
