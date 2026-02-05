import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DiscoveryPage = () => {
    const [users, setUsers] = useState([]);
    const [likedUsers, setLikedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser(user);
                fetchUsers(user.id);
                fetchLikedUsers(user.id);
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchLikedUsers = async (userId) => {
        try {
            // 1. Получаем ID всех, кому я поставил лайк
            const { data: givenLikes, error: givenError } = await supabase
                .from('likes')
                .select('to_user')
                .eq('from_user', userId)
                .eq('is_like', true);

            if (givenError) throw givenError;
            if (!givenLikes || givenLikes.length === 0) {
                setLikedUsers([]);
                return;
            }

            const targetIds = givenLikes.map(l => l.to_user);

            // 2. Получаем профили этих людей
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', targetIds);

            if (profileError) throw profileError;

            // 3. Проверяем взаимность (кто лайкнул меня)
            const { data: receivedLikes } = await supabase
                .from('likes')
                .select('from_user')
                .eq('to_user', userId)
                .in('from_user', targetIds)
                .eq('is_like', true);

            const matchIds = new Set(receivedLikes?.map(l => l.from_user) || []);

            // 4. Совмещаем данные
            const processed = profiles.map(p => ({
                ...p,
                isMatch: matchIds.has(p.id)
            }));

            setLikedUsers(processed);
        } catch (error) {
            console.error('Error fetching liked users:', error.message);
        }
    };

    const fetchUsers = async (userId) => {
        try {
            setLoading(true);
            const { data: reactedData } = await supabase
                .from('likes')
                .select('to_user')
                .eq('from_user', userId);

            const reactedIds = reactedData?.map(r => r.to_user) || [];

            let query = supabase
                .from('profiles')
                .select('id, full_name, age, avatar_url, bio')
                .neq('id', userId);

            if (reactedIds.length > 0) {
                query = query.not('id', 'in', `(${reactedIds.join(',')})`);
            }

            const { data, error } = await query;
            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReaction = async (targetUserId, isLike) => {
        if (!currentUser) return;
        try {
            const { error: insertError } = await supabase
                .from('likes')
                .insert({
                    from_user: currentUser.id,
                    to_user: targetUserId,
                    is_like: isLike
                });

            if (insertError) throw insertError;

            if (isLike) {
                const { data: reciprocalLike } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('from_user', targetUserId)
                    .eq('to_user', currentUser.id)
                    .eq('is_like', true)
                    .single();

                if (reciprocalLike) {
                    alert("Это взаимно! У вас мэтч! 🎉");
                }
                fetchLikedUsers(currentUser.id);
            }
            setUsers(prev => prev.filter(u => u.id !== targetUserId));
        } catch (error) {
            console.error('Error reaction:', error.message);
        }
    };

    return (
        <div className="discovery-page">
            <Header />
            <main className="section container" style={{ paddingTop: '8rem' }}>
                <header className="section-header">
                    <h1 className="section-title gradient-text">Найти пару</h1>
                    <p className="section-subtitle">Посмотрите, кто еще в SoMa сегодня</p>
                </header>

                {/* Блок симпатий - виден только авторизованным */}
                {currentUser && likedUsers.length > 0 && (
                    <div className="sympathies-block animate-fade-in">
                        <h2 className="sympathies-title">Мои симпатии</h2>
                        <div className="sympathies-list">
                            {likedUsers.map((profile) => (
                                <div key={profile.id} className={`sympathy-item ${profile.isMatch ? 'match' : ''}`} title={profile.full_name}>
                                    <div className="sympathy-avatar">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.full_name} />
                                        ) : (
                                            <div className="no-avatar-small">?</div>
                                        )}
                                        {profile.isMatch && <span className="match-badge">👑</span>}
                                    </div>
                                    <span className="sympathy-name">{profile.full_name.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Загрузка анкет...</p>
                    </div>
                ) : (
                    <div className="discovery-grid">
                        {users.map((profile) => (
                            <div key={profile.id} className="user-card glass animate-fade-in">
                                <div className="user-card-image">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name} />
                                    ) : (
                                        <div className="no-avatar">No Photo</div>
                                    )}
                                </div>
                                <div className="user-card-info">
                                    <h3 className="user-card-name">
                                        {profile.full_name}, <span className="user-card-age">{profile.age || '??'}</span>
                                    </h3>
                                    {profile.bio && <p className="user-card-bio">{profile.bio}</p>}
                                    <div className="user-card-actions">
                                        <button className="action-btn dislike" onClick={() => handleReaction(profile.id, false)}>❌</button>
                                        <button className="action-btn like" onClick={() => handleReaction(profile.id, true)}>❤️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>
                                <p>К сожалению, других пользователей пока нет.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default DiscoveryPage;
