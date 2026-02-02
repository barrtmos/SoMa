import React from 'react';

const Features = () => (
    <section className="section">
        <div className="container">
            <div className="section-header">
                <h2 className="section-title">Почему выбирают нас?</h2>
                <p className="section-subtitle">Безопасность, простота и результат — основы нашего сервиса.</p>
            </div>
            <div className="grid-3">
                {[
                    { title: 'Умный подбор', desc: 'Алгоритмы, основанные на психологической совместимости.', icon: '🧠' },
                    { title: 'Верификация', desc: 'Только реальные люди. Мы проверяем каждый профиль.', icon: '✅' },
                    { title: 'Приватность', desc: 'Твои данные под надежной защитой современных технологий.', icon: '🛡️' }
                ].map((f, i) => (
                    <div key={i} className="glass feature-card">
                        <div className="feature-icon">{f.icon}</div>
                        <h3 className="feature-title">{f.title}</h3>
                        <p className="section-subtitle">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Features;
