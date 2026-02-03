import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfileEditPage = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '',
        age: '',
        bio: '',
        avatar_url: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
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

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, age, bio, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    age: data.age || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || ''
                });
                setAvatarPreview(data.avatar_url || '');
            }
        } catch (error) {
            console.error('Error loading user data!', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        const file = event.target.files[0];
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('Пользователь не авторизован');

            let publicUrl = profile.avatar_url;

            // 1. Сначала загружаем фото, если оно выбрано
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile);

                if (uploadError) throw uploadError;

                // 2. Получаем publicURL
                const { data } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                publicUrl = data.publicUrl;
            }

            // 3. Сохраняем данные в таблицу profiles через .upsert()
            const updates = {
                id: user.id,
                full_name: profile.full_name,
                age: profile.age ? parseInt(profile.age, 10) : null,
                bio: profile.bio,
                avatar_url: publicUrl,
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;

            alert('Успех!');
            navigate('/profile');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-edit-page">
            <Header />
            <main className="section container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass" style={{ padding: '2.5rem', maxWidth: '500px', width: '100%' }}>
                    <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Редактировать профиль</h2>

                    <form onSubmit={updateProfile} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)', marginBottom: '0.5rem' }}
                                />
                            ) : (
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', border: '2px dashed rgba(255,255,255,0.3)' }}>
                                    No Image
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={loading}
                                id="avatar-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="avatar-upload" className="btn-secondary" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                Изменить фото
                            </label>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.8 }}>Имя</label>
                            <input
                                type="text"
                                className="auth-input"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                placeholder="Ваше имя"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.8 }}>Возраст</label>
                            <input
                                type="number"
                                className="auth-input"
                                value={profile.age}
                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                placeholder="Ваш возраст"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.8 }}>О себе</label>
                            <textarea
                                className="auth-input"
                                rows="4"
                                style={{ resize: 'none' }}
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Расскажите о себе..."
                            />
                        </div>


                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                            {loading ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfileEditPage;
