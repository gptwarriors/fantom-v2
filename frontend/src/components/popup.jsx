import React from 'react';
import './popup.css';

const Popup = ({ onViewNFT }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <h3>Congratulations!</h3>
        <p>Your NFT is minted successfully.</p>
        <button className="view-button" onClick={onViewNFT}>View NFT</button>
      
      </div>
    </div>
  );
};

export default Popup;