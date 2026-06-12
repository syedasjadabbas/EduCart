import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner-container">
      {/* Animated background elements */}
      <div className="banner-bg-gradient"></div>
      <div className="banner-blob banner-blob-1"></div>
      <div className="banner-blob banner-blob-2"></div>
      
      {/* Main content */}
      <div className="banner-content">
        <div className="banner-text-section">
          <h1 className="banner-title">EduCart</h1>
          <p className="banner-subtitle">
            Production-Oriented Full-Stack E-Commerce Platform
          </p>
          <div className="banner-tech-stack">
            <span className="tech-item">React.js</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">Node.js</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">Express</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">MongoDB</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">JWT</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">AI Chatbot</span>
          </div>
        </div>

        {/* Visual mockups section */}
        <div className="banner-mockups">
          {/* Admin Dashboard mockup */}
          <div className="mockup admin-dashboard">
            <div className="mockup-header">Admin Analytics Overview</div>
            <div className="mockup-content">
              <div className="analytics-row">
                <span className="analytics-label">Sales Overview</span>
                <span className="analytics-label">Revenue Growth</span>
              </div>
              <div className="chart-placeholder">
                <svg viewBox="0 0 200 100" className="mini-chart">
                  <polyline points="10,80 40,60 70,70 100,40 130,50 160,30 190,20" 
                    fill="none" stroke="url(#gradientChart)" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="gradientChart" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor: '#00d4ff', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#7c3aed', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="analytics-stats">
                <div className="stat">
                  <span className="stat-label">Current Month Revenue:</span>
                  <span className="stat-value">$1,250.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products grid mockup */}
          <div className="mockup products-grid">
            <div className="product-card">
              <div className="product-icon">💻</div>
              <div className="product-name">Modern Web Dev</div>
              <div className="product-price">$100</div>
            </div>
            <div className="product-card">
              <div className="product-icon">🤖</div>
              <div className="product-name">AI Fundamentals</div>
              <div className="product-price">$100</div>
            </div>
            <div className="product-card">
              <div className="product-icon">📊</div>
              <div className="product-name">Data Science Kit</div>
              <div className="product-price">$100</div>
            </div>
          </div>

          {/* System Architecture mockup */}
          <div className="mockup system-architecture">
            <div className="mockup-header">System Architecture Vibe</div>
            <div className="architecture-diagram">
              <div className="arch-layer">Database</div>
              <div className="arch-connector"></div>
              <div className="arch-layer">API Layer</div>
              <div className="arch-connector"></div>
              <div className="arch-layer">Frontend</div>
            </div>
          </div>

          {/* Cart/Mobile mockup */}
          <div className="mockup mobile-cart">
            <div className="mobile-header">My Cart</div>
            <div className="cart-items">
              <div className="cart-item">
                <span className="item-name">AI for Beginners Course</span>
                <span className="item-price">$125.00</span>
              </div>
              <div className="cart-item">
                <span className="item-name">Modern Web Development</span>
                <span className="item-price">$125.00</span>
              </div>
            </div>
            <div className="cart-total">
              <span>Total:</span>
              <span>$250.00</span>
            </div>
            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="banner-cta">
        <button className="cta-button">Explore Platform</button>
      </div>
    </div>
  );
};

export default Banner;
