import React from 'react';

const Hero = () => (
    <section className="hero">
        <div className="container animate-fade-in hero-grid">
            <div>
                <h1 className="hero-title">
                    <span className="text-warm">Найди свою</span> <span className="gradient-text">искру</span> <br />
                    <span className="text-warm">в мире SoMa</span>
                </h1>
                <p className="hero-text">
                    Мы объединяем сердца с помощью умных алгоритмов и глубокого понимания личности. Начни свою историю любви сегодня - не теряй время.
                </p>
                <div className="hero-btns">
                    <button className="btn-primary">Начать поиск</button>
                    <button className="glass" style={{ padding: '1rem 2rem', borderRadius: '50px', fontWeight: 600 }}>Узнать больше</button>
                </div>
            </div>
            <div className="glass hero-img-container">
                <img
                    src="https://images.unsplash.com/photo-1516589174184-c68526674fd6?q=80&w=1287&auto=format&fit=crop"
                    alt="Dating"
                    className="hero-img"
                />
                <div className="glass match-card">
                    <div className="match-icon">❤️</div>
                    <div>
                        <div className="match-info-title">Мэтч найден!</div>
                        <div className="match-info-subtitle">Анна, 24 года • 98% совместимости</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="hero-bg-glow"></div>
    </section>
);

export default Hero;
