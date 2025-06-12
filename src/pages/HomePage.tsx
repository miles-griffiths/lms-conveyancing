import React from 'react';
import Header from "../components/Header"; // Adjust path as needed

import logo from '../assets/lms-logo.svg';
import dashboardIcon from '../assets/dashboard.png';
import remortgageIcon from '../assets/remortgage.png';
import saleIcon from '../assets/sale.png';
import purchaseIcon from '../assets/purchase.png';
import lettingsIcon from '../assets/lettings.png';
import '../styles/homepage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <Header />

      <section className="quick-links-section">
        <div className="section-header">Quick Links</div>

        <div className="tile-grid">
          <div className="tile">
            <img src={dashboardIcon} alt="Main Dashboard" className="tile-icon" />
            <p>Main Dashboard</p>
          </div>
          <div className="tile">
            <img src={remortgageIcon} alt="Remortgage Case 7454" className="tile-icon" />
            <p>Remortgage Case 7454</p>
          </div>
          <div className="tile">
            <img src={remortgageIcon} alt="Remortgage Case 6541" className="tile-icon" />
            <p>Remortgage Case 6541</p>
          </div>
          <div className="tile">
            <img src={remortgageIcon} alt="Remortgage Case 6541" className="tile-icon" />
            <p>Remortgage Case 6541</p>
          </div>
        </div>  
      </section>

      <section className="section-block">
        <div className="section-header">Conveyancing</div>
        <div className="tile-grid">
          <div className="tile">
            <img src={remortgageIcon} alt="Remortgage" className="tile-icon" />
            <p>Remortgage</p>
          </div>
          <div className="tile">
            <img src={saleIcon} alt="Sale" className="tile-icon" />
            <p>Sale</p>
          </div>
          <div className="tile">
            <img src={purchaseIcon} alt="Purchase" className="tile-icon" />
            <p>Purchase</p>
          </div>
          <div className="tile">
            <img src={lettingsIcon} alt="Lettings" className="tile-icon" />
            <p>Lettings</p>
          </div>
        </div>
      </section>


      
    </div>
  );
};

export default HomePage;
