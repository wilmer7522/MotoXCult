import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Shop.css';

const Shop = () => {
  const { t } = useLanguage();

  const raffles = [
    { id: 1, title: 'Casco Certificado LS2', price: '$10.000', icon: '🪖', active: true },
    { id: 2, title: 'Guantes de Cuero Pro', price: '$5.000', icon: '🧤', active: true }
  ];

  return (
    <div className="shop-page full-bleed">
      <div className="container">
        <div className="shop-container">
          <section className="donations-banner">
            <h2>{t.shop.supportTitle}</h2>
            <p>{t.shop.supportDesc}</p>
            <div className="donation-options">
              <button className="secondary-btn">$5.000</button>
              <button className="cta">$10.000</button>
              <button className="secondary-btn">$20.000</button>
              <input type="text" placeholder="Otro monto" className="custom-amount" />
            </div>
            <div className="payment-methods">
              <div className="method-badge">NEQUI</div>
              <div className="method-badge">PSE</div>
              <span>QR / Link de Pago</span>
            </div>
          </section>

          <section className="raffles-section">
            <h2>{t.shop.rafflesTitle}</h2>
            <div className="raffle-grid">
              {raffles.map(raffle => (
                <div key={raffle.id} className="raffle-card">
                  <div className="raffle-visual">
                    <span className="raffle-icon">{raffle.icon}</span>
                  </div>
                  <div className="raffle-info">
                    <h3>{raffle.title}</h3>
                    <p>Valor por boleta: <span className="price">{raffle.price}</span></p>
                    <div className="raffle-numbers">
                      Generando número...
                    </div>
                    <button className="cta buy-btn">{t.shop.buyTicket}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="membership-section">
            <h2>{t.shop.membershipTitle}</h2>
            <div className="premium-card">
              <div className="premium-header">
                <h3>Role Suscriptor</h3>
                <span className="price">$15.000 / mes</span>
              </div>
              <ul>
                <li>Acceso a Rodadas Exclusivas</li>
                <li>Insignia dorada en el foro</li>
                <li>Descuentos en sorteos</li>
              </ul>
              <button className="cta">{t.shop.joinNow}</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shop;
