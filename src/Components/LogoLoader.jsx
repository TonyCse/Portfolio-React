import React from 'react';

const LogoLoader = () => {

  const loading="Chargement...";

  return (
    <div>
      {/* <div className='loader-txt'>
        <h2 data-text={loading}>CHARGEMENT...</h2>
      </div> */}
      <div className="loader">
        <div className="loader-circle">
          <div>
            <div className="loader moon-loader">
              <div className="loader-circle">
                <div className="loader-moon-size"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="loader-sun"></div>
      </div>
    </div>
  );
};

export default LogoLoader;