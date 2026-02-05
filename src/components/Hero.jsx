import React, { useState, useEffect } from 'react';

const slides = [
    {
        image: '/photo-1.png',
        title: 'Мэтч найден!',
        subtitle: 'Анна, 24 года • 98% совместимости',
        icon: '❤️'
    },
    {
        image: '/photo-2.jpg',
        title: 'Новое сообщение',
        subtitle: 'Марк, 28 лет • 95% совместимости',
        icon: '💬'
    }
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
                setIsFading(false);
            }, 600); // Совпадает с длительностью transition в CSS
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const currentSlide = slides[currentIndex];

    return (
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
                <div className={`glass hero-img-container hero-slide-content ${isFading ? 'fade-out' : 'fade-in'}`}>
                    <img
                        src={currentSlide.image}
                        alt="SoMa Match"
                        className="hero-img"
                    />
                    <div className="glass match-card">
                        <div className="match-icon">{currentSlide.icon}</div>
                        <div>
                            <div className="match-info-title">{currentSlide.title}</div>
                            <div className="match-info-subtitle">{currentSlide.subtitle}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hero-bg-glow"></div>
        </section>
    );
};

export default Hero;
