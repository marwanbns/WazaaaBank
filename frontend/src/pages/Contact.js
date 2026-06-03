import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/contact2");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%", borderRadius: "10px" }}>
        <h2 className="text-center mb-4">📩 Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="name"><i className="fas fa-user"></i> Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className="form-control" 
              placeholder="Enter your name" 
              required 
              value={formData.name} 
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email"><i className="fas fa-envelope"></i> Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="form-control" 
              placeholder="Enter your email" 
              required 
              value={formData.email} 
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="message"><i className="fas fa-comment"></i> Message:</label>
            <textarea 
              id="message" 
              name="message" 
              className="form-control" 
              rows="5" 
              placeholder="Write your message..." 
              required 
              value={formData.message} 
              onChange={handleChange}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary btn-lg">
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;