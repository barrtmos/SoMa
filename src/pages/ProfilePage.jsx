import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/auth');
                return;
            }

            let { data, error } = await supabase
                .from('profiles')
                .select(`full_name, age, bio, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error) {
                console.error(error);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error loading user data!', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="profile-page">
            <Header />
            <main className="section container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <>
                            <div style={{ marginBottom: '2rem' }}>
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="Avatar"
                                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)' }}
                                    />
                                ) : (
                                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '2px dashed rgba(255,255,255,0.3)' }}>
                                        No Photo
                                    </div>
                                )}
                            </div>
                            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                {profile?.full_name || 'Пользователь'}
                            </h2>
                            {profile?.age && (
                                <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '1rem' }}>
                                    Возраст: {profile.age}
                                </p>
                            )}
                            {profile?.bio && (
                                <p className="section-subtitle" style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                                    "{profile.bio}"
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                                <button className="btn-secondary" onClick={() => navigate('/profile/edit')}>
                                    Редактировать
                                </button>
                                <button className="btn-danger" onClick={handleSignOut}>
                                    Выйти
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
