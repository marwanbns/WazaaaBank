import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {/* Logo en haut */}
      <div className="logo-container">
        <a href="https://youtu.be/NsJLhRGPv-M?t=23" target="_blank" rel="noopener noreferrer">
          <img src={require("../static/images/WAZAA.png")} alt="Wazaa Bank Logo" />
        </a>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Contenu dynamique */}
      <div className="content-container">{children}</div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;