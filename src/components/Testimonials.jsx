import React from 'react';

const Testimonials = () => (
    <section className="section">
        <div className="container">
            <div className="section-header">
                <h2 className="section-title">Те, кто нашли друг друга</h2>
            </div>
            <div className="grid-3">
                {[
                    { name: 'Елена и Марк', text: 'Мы нашли друг друга в первый же день! Спасибо SoMa за этот шанс.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60' },
                    { name: 'Дмитрий и София', text: 'Алгоритм совместимости действительно работает. Мы на одной волне.', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60' }
                ].map((t, i) => (
                    <div key={i} className="glass testimonial-card">
                        <img src={t.img} alt={t.name} className="testimonial-avatar" />
                        <p className="testimonial-text">"{t.text}"</p>
                        <h4 className="testimonial-name">{t.name}</h4>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Testimonials;
