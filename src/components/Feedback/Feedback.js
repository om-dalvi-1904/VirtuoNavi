import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      'service_2zge616', 
      'template_f8opq3v', 
      e.target, 
      'kwWlF9HP_LQ3slrt9'
    ).then((result) => {
      alert('Feedback successfully sent!');
    }).catch((error) => {
      console.error(error.text);
    });
    e.target.reset();
  };

  return (
    <div className="feedback-container">
      <h2>We'd Love Your Feedback</h2>
      <form onSubmit={sendEmail} className="feedback-form">
        <input
          type="text"
          className="form-input"
          name="user_name"
          placeholder="Enter Your Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="form-input"
          name="user_email"
          placeholder="Enter Your Email"
          onChange={handleChange}
          required
        />
        <textarea
          className="form-input"
          name="message"
          placeholder="Your Feedback"
          rows="6"
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="submit-btn">Submit Feedback</button>
      </form>
      <footer className="footer">
        <p>&copy; 2024 PCCOE VirtuoNavi - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Feedback;
