import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
export default function Footer() {
  const [formData, setFormdata] = useState({ gmail: "", message: "" });
  const gmailInp = useRef(null);
  const messageInp = useRef(null);
  const valueOnChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formData, [name]: value });
  };
  const submitFormData = (e) => {
    e.preventDefault();
    const mailError = document.getElementById("mailError");
    const messageError = document.getElementById("messageError");
    var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    console.log(emailfilter.test(formData.gmail));
    if (formData.gmail === "") {
      mailError.innerHTML = `Gmail field must not be empty`;
      gmailInp.current.style.borderBottom = ".2rem solid #EE0000 ";
    } else {
      mailError.innerHTML = ``;
      gmailInp.current.style.borderBottom = ".2rem solid #445 ";
      if (!emailfilter.test(formData.gmail)) {
        mailError.innerHTML = `Please enter valid gmail`;
        gmailInp.current.style.borderBottom = ".2rem solid #EE0000 ";
      } else {
        gmailInp.current.style.borderBottom = ".2rem solid #445 ";
        mailError.innerHTML = ``;
      }
    }
    if (formData.message === "") {
      messageError.innerHTML = ` Message field must not be empty`;
      messageInp.current.style.borderBottom = ".2rem solid #EE0000 ";
    } else {
      messageInp.current.style.borderBottom = ".2rem solid #445 ";
      messageError.innerHTML = ``;
    }
  };
  return (
    <footer>
      <div className="first-section">
        <p className="copyright">&copy; Copyright 2024 Swipe 4 Jobs </p>
        <div className="second-section">
          {/* <form action="">
            <div className="contactText">Contact us</div>
            <input
              onChange={valueOnChange}
              value={formData.gmail}
              type="gmail"
              name="gmail"
              id="gmail"
              ref={gmailInp}
              placeholder="example@gmail.com"
            />
            <div className="errorMessage" id="mailError"></div>
            <textarea
              onChange={valueOnChange}
              value={formData.message}
              name="message"
              id="message"
              ref={messageInp}
              placeholder="message..."
              rows={4}
            ></textarea>
            <div className="errorMessage" id="messageError"></div>
            <button onClick={submitFormData} aria-label="submit button">
              SUBMIT
            </button>
          </form> */}

          <Link to="/terms-of-use" aria-label="terms of use link">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
