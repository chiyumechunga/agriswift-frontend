import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="agri-landing">
            {/* Header / Navbar */}
            <header className="agri-header">
                <div className="agri-container">
                    <nav className="agri-nav">
                        <Link to="/" className="agri-brand">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                agriculture
              </span>
                            <span>AgriSwift</span>
                        </Link>

                        <ul className="agri-nav-links">
                            <li><a href="#purpose" className="agri-nav-link">Why AgriSwift</a></li>
                            <li><a href="#features" className="agri-nav-link">Key Features</a></li>
                            <li><a href="#portal" className="agri-nav-link">Portal Access</a></li>
                        </ul>

                        <div className="agri-nav-actions">
                            <Link to="/login" className="agri-btn agri-btn-outline">
                                Log In
                            </Link>
                            <Link to="/signup" className="agri-btn agri-btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="agri-hero">
                <div className="agri-container">
                    <div className="agri-hero-grid">
                        <div>
                            <div className="agri-pill-badge">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  bolt
                </span>
                                <span>The Modern FRA Alternative</span>
                            </div>
                            <h1 className="agri-hero-title">
                                Smarter Grain Procurement &amp; Instant Farmer Settlement
                            </h1>
                            <p className="agri-hero-desc">
                                AgriSwift is an agile digital alternative to the traditional Food Reserve Agency (FRA) web portal. Designed specifically for rural Zambian depots with offline capability and sub-minute mobile money payouts.
                            </p>
                            <div className="agri-hero-cta">
                                <Link to="/signup" className="agri-btn agri-btn-primary agri-btn-lg">
                                    Create an Account
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                                <Link to="/login" className="agri-btn agri-btn-outline agri-btn-lg">
                                    Access Portal
                                </Link>
                            </div>
                        </div>

                        <div className="agri-hero-image-wrapper">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUYkfr_Zox_XcHYm4iQzQTGS1m-RsKsZN_Xu8H9hGZG13AAnycYgFi9i-oigpwj6dXpNkwhEUFib_SEgyR4fZzKI-hgXyklJb6OtBQy3eBOzmYvbQWXXhR8zUun9qGVW66cma_ZgobGgcmUIqck22KoYuuiVjpCOQtw1wObyuhIoRuIkfuernZm7p9Bo2O1n_zqnJsv0d3yms06c4wMpxVXBdChummHlqXFG0sU68sdkG1VAFsfxXp3A"
                                alt="Maize harvest ready for FRA intake"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Purpose & Comparison Section */}
            <section id="purpose" className="agri-purpose-section">
                <div className="agri-container">
                    <div className="agri-section-header">
                        <span className="agri-section-tag">Purpose &amp; Vision</span>
                        <h2 className="agri-section-title">Why Choose AgriSwift over the Official Portal?</h2>
                    </div>

                    <div className="agri-comparison-grid">
                        {/* Standard FRA Portal */}
                        <div className="agri-card agri-card-fra">
                            <h3 className="agri-card-title">
                                <span className="material-symbols-outlined agri-icon-cross">cancel</span>
                                Official Legacy FRA Portal
                            </h3>
                            <ul className="agri-list">
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-cross">close</span>
                                    Requires continuous, strong internet connectivity at remote sheds.
                                </li>
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-cross">close</span>
                                    Delayed voucher processing taking weeks for bank clearance.
                                </li>
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-cross">close</span>
                                    Manual paperwork leading to bottlenecks during peak harvest intake.
                                </li>
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-cross">close</span>
                                    Opaque tracking of moisture deductions and weighbridge logs.
                                </li>
                            </ul>
                        </div>

                        {/* AgriSwift Alternative */}
                        <div className="agri-card agri-card-agriswift">
                            <h3 className="agri-card-title">
                                <span className="material-symbols-outlined agri-icon-check">check_circle</span>
                                The AgriSwift Platform
                            </h3>
                            <ul className="agri-list">
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-check">check</span>
                                    <strong>Offline-First Resilience:</strong> Record grain intake anywhere; syncs when online.
                                </li>
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-check">check</span>
                                    <strong>Instant Disbursal:</strong> Automatic payout to Mobile Money (Airtel/MTN/Zamtel) in &lt; 45s.
                                </li>
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-check">check</span>
                                    <strong>Real-time ZIAMIS Lookup:</strong> Automated quota and identity validation using NRC.
                                </li>
                                <li className="agri-list-item">
                                    <span className="material-symbols-outlined agri-icon-check">check</span>
                                    <strong>Transparent Receipts:</strong> Digital receipts issued via SMS &amp; printable thermal tickets.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Section */}
            <section id="features" className="agri-features-section">
                <div className="agri-container">
                    <div className="agri-section-header">
                        <span className="agri-section-tag">Platform Highlights</span>
                        <h2 className="agri-section-title">Built for Farmers, Depot Clerks &amp; Buyers</h2>
                    </div>

                    <div className="agri-features-grid">
                        <div className="agri-feature-card">
                            <div className="agri-feature-icon">
                                <span className="material-symbols-outlined">wifi_off</span>
                            </div>
                            <h3 className="agri-feature-title">Offline Shed Mode</h3>
                            <p className="agri-feature-desc">
                                Log grain moisture, weight, and farmer details even in deep rural areas with zero cellular service.
                            </p>
                        </div>

                        <div className="agri-feature-card">
                            <div className="agri-feature-icon">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <h3 className="agri-feature-title">Instant Settlement</h3>
                            <p className="agri-feature-desc">
                                Direct integration with National Financial Switch guarantees funds hit farmer wallets immediately.
                            </p>
                        </div>

                        <div className="agri-feature-card">
                            <div className="agri-feature-icon">
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                            <h3 className="agri-feature-title">ZIAMIS Sync</h3>
                            <p className="agri-feature-desc">
                                Automatic checking of subsidized input quotas and farmer identity via National Registration Cards.
                            </p>
                        </div>

                        <div className="agri-feature-card">
                            <div className="agri-feature-icon">
                                <span className="material-symbols-outlined">shield</span>
                            </div>
                            <h3 className="agri-feature-title">Audited Ledger</h3>
                            <p className="agri-feature-desc">
                                Tamper-proof record-keeping guarantees accountability across Ministry, FRA, and bank partners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Login & Sign Up CTA Section */}
            <section id="portal" className="agri-cta-section">
                <div className="agri-container">
                    <div className="agri-cta-banner">
                        <h2 className="agri-cta-title">Ready to Access AgriSwift?</h2>
                        <p className="agri-cta-desc">
                            Sign up today as a farmer or log in to your depot terminal account to manage crop intake and disbursements.
                        </p>
                        <div className="agri-cta-buttons">
                            <Link to="/signup" className="agri-btn agri-btn-secondary agri-btn-lg">
                                Create New Account
                            </Link>
                            <Link to="/login" className="agri-btn agri-btn-outline agri-btn-lg" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                                Existing User Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="agri-footer">
                <div className="agri-container">
                    <div className="agri-footer-inner">
                        <div>
                            <strong>AgriSwift Portal</strong> — An independent, modern alternative for FRA procurement.
                        </div>
                        
                        <div>
                            © {new Date().getFullYear()} AgriSwift. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}