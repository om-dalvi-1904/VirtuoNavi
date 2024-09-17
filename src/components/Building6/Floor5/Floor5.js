import React, { useEffect } from 'react';
import './Floor5.css';

const Floor5 = () => {
  useEffect(() => {
    const svgObject = document.getElementById('svgObject');
    const popup = document.getElementById('popup');
    const popupClose = document.getElementById('popupClose');
    
    const handleSvgLoad = () => {
      const svgDocument = svgObject.contentDocument;
      const referElement = svgDocument.getElementById('refer');

      if (referElement) {
        referElement.addEventListener('click', (event) => {
          const svgRect = referElement.getBoundingClientRect();
          
          // Position popup next to the SVG anchor
          popup.style.left = `${svgRect.left}px`;
          popup.style.top = `${svgRect.bottom + window.scrollY}px`;
          popup.style.display = 'block';
        });
      }
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('#popup') && !event.target.closest('#refer')) {
        popup.style.display = 'none';
      }
    };

    const handlePopupClose = () => {
      popup.style.display = 'none';
    };

    if (svgObject) {
      svgObject.addEventListener('load', handleSvgLoad);
    }

    document.addEventListener('click', handleClickOutside);
    popupClose.addEventListener('click', handlePopupClose);

    // Cleanup event listeners on component unmount
    return () => {
      if (svgObject) {
        svgObject.removeEventListener('load', handleSvgLoad);
      }
      document.removeEventListener('click', handleClickOutside);
      popupClose.removeEventListener('click', handlePopupClose);
    };
  }, []);

  return (
    < body class='body'>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      {/* Bootstrap CSS */}
      <link
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      <div className='floorplan'>
        <h1 className='h1'>Welcome To Virtual Campus </h1>
        <h2 className='h2'>Here's the 5th Floor of our Building</h2>
        <object
          id="svgObject"
          type="image/svg+xml"
          data="/images/Bldg6Floor5.svg"
          aria-label="Building 6 Floor 5 SVG"
        >
          <p>Your browser does not support SVGs. Consider updating your browser for a better experience.</p>
        </object>
      </div>
      {/* Popup */}
      <div id="popup" className="p-3 border rounded shadow">
        <div className="popup-header">
          <h5 className="popup-title">6506LA</h5>
          <span id="popupClose" className="close">
            ×
          </span>
        </div>
        <p>This is The Basic Electrical And Electronics Lab (BEE)</p>
        <p>Faculties available in lab are as follows:</p>
        <ol>
          <li>Mrs. Ashwini Deshpande</li>
          <li>Mrs. Pranjal Jog</li>
          <li>Mrs. Suwarna Shete</li>
        </ol>
      </div>
    </body>
  );
};

export default Floor5;
