import React, { useState } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const ComposeEmail = ({openProps}) => {
  const [isOpen, setIsOpen] = useState(openProps);
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });

  const handleTogglePopup = () => {
    setIsOpen({openProps});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform email sending logic here (e.g., using an API or backend)
    console.log('Email Data:', emailData);
    // Close the compose popup after sending
    setIsOpen(false);
  };

  return (
    <div className="compose-email">
      {isOpen && (
        <div className="compose-popup">
          <div className="compose-header">
            <h2 className="compose-title">New Email</h2>
            <button className="close-btn" onClick={handleTogglePopup}>
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="to"
              className="compose-input"
              placeholder="To"
              value={emailData.to}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              className="compose-input"
              placeholder="Subject"
              value={emailData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="body"
              className="compose-textarea"
              placeholder="Write your message here"
              value={emailData.body}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="send-btn">
              Send
            </button>
           
          </form>
        </div>
      )}
    </div>
  );
};

export default ComposeEmail;
