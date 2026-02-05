import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DiscoveryPage = () => {
    const [users, setUsers] = useState([]);
    const [myLikes, setMyLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser(user);
                fetchUsers(user.id);
                fetchMyLikes(user.id);
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchMyLikes = async (userId) => {
        try {
            // 1. Кого лайкнул я
            const { data: givenLikes, error: givenError } = await supabase
                .from('likes')
                .select(`
                    to_user,
                    profiles:to_user (id, full_name, avatar_url)
                `)
                .eq('from_user', userId)
                .eq('is_like', true);

            if (givenError) throw givenError;

            // 2. Кто лайкнул меня
            const { data: receivedLikes } = await supabase
                .from('likes')
                .select('from_user')
                .eq('to_user', userId)
                .eq('is_like', true);

            const receivedIds = new Set(receivedLikes?.map(l => l.from_user) || []);

            const processedLikes = givenLikes?.map(like => ({
                ...like.profiles,
                isMatch: receivedIds.has(like.to_user)
            })) || [];

            setMyLikes(processedLikes);
        } catch (error) {
            console.error('Error fetching my likes:', error.message);
        }
    };

    const fetchUsers = async (userId) => {
        try {
            setLoading(true);

            // Получаем список ID тех, кому мы уже поставили лайк/дизлайк
            const { data: reactedData } = await supabase
                .from('likes')
                .select('to_user')
                .eq('from_user', userId);

            const reactedIds = reactedData?.map(r => r.to_user) || [];

            let query = supabase
                .from('profiles')
                .select('id, full_name, age, avatar_url, bio')
                .neq('id', userId);

            // Если есть те, на кого уже отреагировали - исключаем их
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
            // 1. Записываем реакцию в базу
            const { error: insertError } = await supabase
                .from('likes')
                .insert({
                    from_user: currentUser.id,
                    to_user: targetUserId,
                    is_like: isLike
                });

            if (insertError) throw insertError;

            // 2. Если это лайк, проверяем на взаимность и обновляем список симпатий
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

                // Сразу обновляем список моих симпатий
                fetchMyLikes(currentUser.id);
            }

            // 3. Убираем карточку из списка (скрываем)
            setUsers(prevUsers => prevUsers.filter(u => u.id !== targetUserId));

        } catch (error) {
            console.error('Error processing reaction:', error.message);
            alert('Произошла ошибка при сохранении реакции.');
        }
    };

    const handleLike = (userId) => handleReaction(userId, true);
    const handleDislike = (userId) => handleReaction(userId, false);

    return (
        <div className="discovery-page">
            <Header />
            <main className="section container" style={{ paddingTop: '8rem' }}>
                <header className="section-header">
                    <h1 className="section-title gradient-text">Найти пару</h1>
                    <p className="section-subtitle">Посмотрите, кто еще в SoMa сегодня</p>
                </header>

                {/* Блок симпатий */}
                {myLikes.length > 0 && (
                    <div className="sympathies-block animate-fade-in">
                        <h2 className="sympathies-title">Мои симпатии</h2>
                        <div className="sympathies-list">
                            {myLikes.map((profile) => (
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
                                        <button
                                            className="action-btn dislike"
                                            onClick={() => handleDislike(profile.id)}
                                            title="Дизлайк"
                                        >
                                            ❌
                                        </button>
                                        <button
                                            className="action-btn like"
                                            onClick={() => handleLike(profile.id)}
                                            title="Лайк"
                                        >
                                            ❤️
                                        </button>
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
