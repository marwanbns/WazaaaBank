import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loginMsg = localStorage.getItem("loginMessage");
    const logoutMsg = localStorage.getItem("logoutMessage");

    if (loginMsg) {
      setMessage(loginMsg);
      localStorage.removeItem("loginMessage");
    } else if (logoutMsg) {
      setMessage(logoutMsg);
      localStorage.removeItem("logoutMessage");
    }
  }, []);

  return (
    <div>
      <div className="container text-center">
        {message && <div className="alert alert-success">{message}</div>}
        <h1 className="mt-4 mb-3">Welcome to Wazaa Bank</h1>
        <p className="lead">Your Trusted Partner in Financial Solutions</p>
      </div>

      <div className="container services-container">
        <div className="row">
          <div className="col-md-6">
            <div className="card service-card">
              <img src={require("../static/images/personal_banking.png")} alt="Personal Banking" />
              <div className="service-card-body">
                <h2>Personal Banking</h2>
                <p>Manage your personal finances with ease. Our user-friendly online banking system provides you with full control over your accounts.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card service-card">
              <img src={require("../static/images/business_solutions.png")} alt="Business Solutions" />
              <div className="service-card-body">
                <h2>Business Solutions</h2>
                <p>Explore our tailored business banking services. From small businesses to corporations, we have the right solutions for your financial needs.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <div className="card service-card">
              <img src={require("../static/images/mortgage_services.png")} alt="Mortgage Services" />
              <div className="service-card-body">
                <h2>Mortgage Services</h2>
                <p>Turn your dream home into a reality with our competitive mortgage rates and personalized mortgage services.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card service-card">
              <img src={require("../static/images/investment_opportunities.png")} alt="Investment Opportunities" />
              <div className="service-card-body">
                <h2>Investment Opportunities</h2>
                <p>Grow your wealth with our diverse investment options. From stocks to mutual funds, we help you make informed investment decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .services-container {
            margin-top: 40px;
          }
          .service-card {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            background: white;
            transition: transform 0.3s ease-in-out;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .service-card:hover {
            transform: scale(1.05);
          }
          .service-card img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-bottom: 3px solid #007bff;
          }
          .service-card-body {
            padding: 15px;
            text-align: center;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .service-card-body h2 {
            font-size: 1.2rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .service-card-body p {
            color: #666;
            font-size: 1rem;
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
};

export default Home;