import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Проверка текущей сессии
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Подписка на изменения состояния авторизации
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAuthClick = () => {
        if (user) {
            navigate('/profile');
        } else {
            navigate('/auth');
        }
    };

    return (
        <header className="glass navbar">
            <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                SoMa
            </div>
            <nav className="nav-links">
                <a href="#" className="nav-link">Как это работает</a>
                <a href="#" className="nav-link">Отзывы</a>
            </nav>
            <button className="btn-primary nav-btn" onClick={handleAuthClick}>
                {user ? 'Профиль' : 'Войти'}
            </button>
        </header>
    );
};

export default Header;
