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
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuth = async (e, mode) => {
        e.preventDefault();

        // 1. Очистка сообщений при любом клике
        setMessage('');

        // 2. Если режим кнопки не совпадает с текущим режимом — просто переключаем режим
        if ((mode === 'login' && !isLogin) || (mode === 'signup' && isLogin)) {
            setIsLogin(mode === 'login');
            return;
        }

        // 3. Проверка на пустые поля
        if (!email.trim() || !password.trim()) {
            setMessage('Ошибка: Заполните все поля');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/profile/edit');
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Регистрация успешна! Перенаправляем...');
                setTimeout(() => {
                    navigate('/profile/edit');
                }, 1500);
            }
        } catch (error) {
            setMessage(`Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <main className="section container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                    <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                        {isLogin ? 'Вход в SoMa' : 'Регистрация в SoMa'}
                    </h2>

                    <form className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />

                        {message && (
                            <p style={{ color: message.startsWith('Ошибка') ? '#ff4d4d' : '#4dff4d', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                                {message}
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                className={isLogin ? "btn-primary" : "btn-secondary"}
                                onClick={(e) => handleAuth(e, 'login')}
                                disabled={loading}
                                style={{ flex: 1, ...(isLogin ? {} : { backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }) }}
                            >
                                {loading && isLogin ? '...' : 'Войти'}
                            </button>
                            <button
                                type="button"
                                className={!isLogin ? "btn-primary" : "btn-secondary"}
                                onClick={(e) => handleAuth(e, 'signup')}
                                disabled={loading}
                                style={{ flex: 1, ...(!isLogin ? {} : { backgroundColor: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }) }}
                            >
                                {loading && !isLogin ? '...' : 'Регистрация'}
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
