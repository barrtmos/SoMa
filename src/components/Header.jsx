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
                <Link to="/" className="nav-link">Найти пару</Link>
                <Link to="/about" className="nav-link">Как это работает</Link>
                <a href="#" className="nav-link">Отзывы</a>
                {user && (
                    <Link to="/profile/edit" className="nav-link">
                        Редактировать профиль
                    </Link>
                )}
            </nav>
            <button className="btn-primary nav-btn" onClick={handleAuthClick}>
                {user ? 'Профиль' : 'Войти'}
            </button>
        </header>
    );
};

export default Header;
