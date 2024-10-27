import React, { useEffect, useRef, useState } from "react";
import { FaIcons, MdIcons } from "../assets/Icons/icons";
import "../styles/App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ButtonLoader from "../components/ButtonLoader";
export default function Root() {
  const navigate = useNavigate();
  const [inpValue, setValue] = useState({ email: "", password: "" });
  const emailContainerRef = useRef(null);
  const passwordContainerRef = useRef(null);
  const passwordInputRef = useRef(null);
  const emailInputErrorMessageRef = useRef(null);
  const passwordInputErrorMessageRef = useRef(null);
  const errorMessageRef = useRef(null);
  const [hiddenPas, setHiddenpas] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const host = import.meta.env.VITE_HOST;
  const togglePassword = () => {
    if (passwordInputRef.current.type === "password") {
      passwordInputRef.current.type = "text";
      setHiddenpas(false);
    } else {
      passwordInputRef.current.type = "password";
      setHiddenpas(true);
    }
  };
  const inputValueOnChange = (e) => {
    const { name, value } = e.target;
    setValue({ ...inpValue, [name]: value });
  };
  const loginOnClick = (e) => {
    e.preventDefault();
    let isValid = true;
    // Form validation check
    if (inpValue.email === "" || inpValue.email.length <= 0) {
      emailInputErrorMessageRef.current.innerText = `Email field must not be empty`;
      emailContainerRef.current.style.background = "#ff000036";
      emailContainerRef.current.style.border = ".15rem solid #ee0000";
      isValid = false;
      return;
    } else {
      emailInputErrorMessageRef.current.innerText = ``;
      emailContainerRef.current.style.background = "transparent";
      emailContainerRef.current.style.border = ".15rem solid #d8dcd8";
      var emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(inpValue.email)) {
        emailInputErrorMessageRef.current.innerText = `Please enter valid password`;
        emailContainerRef.current.style.background = "#ff000036";
        emailContainerRef.current.style.border = ".15rem solid #ee0000";
        isValid = false;
        return;
      } else {
        emailInputErrorMessageRef.current.innerText = ``;
        emailContainerRef.current.style.background = "transparent";
        emailContainerRef.current.style.border = ".15rem solid #d8dcd8";
      }
    }

    if (inpValue.password === "" || inpValue.password.length <= 0) {
      passwordInputErrorMessageRef.current.innerText = `Password field must not be empty`;
      passwordContainerRef.current.style.background = "#ff000036";
      passwordContainerRef.current.style.border = ".15rem solid #ee0000";
      isValid = false;
      return;

    } else {
      passwordInputErrorMessageRef.current.innerText = ``;
      passwordContainerRef.current.style.background = "transparent";
      passwordContainerRef.current.style.border = ".15rem solid #d8dcd8";

      const pattern =
        /^(?=.*\d)(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])(?=.*[a-z])(?=.*[A-Z]).{6,30}$/;
      if (!pattern.test(inpValue.password)) {
        passwordInputErrorMessageRef.current.innerText = `Password must be at least 6 characters long, including one uppercase letter and one special character.`;
        passwordContainerRef.current.style.background = "#ff000036";
        passwordContainerRef.current.style.border = ".15rem solid #ee0000";
        isValid = false;
        return;
      } else {
        passwordInputErrorMessageRef.current.innerText = ``;
        passwordContainerRef.current.style.background = "transparent";
        passwordContainerRef.current.style.border = ".15rem solid #d8dcd8";
      }
    }

    if (isValid) {
      setIsLoading(true);
      axios
        .post(`${host}/auth/admin/existing/access`, {
          email: inpValue.email,
          password: inpValue.password,
        })
        .then((res) => {
          if (res.data.success === true) {
            setIsLoading(false);
            navigate(`/secure/admin-verification/${res.data.id}`);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          const errorMsg = document.getElementById("errorMsg");

          if (error.response.data.type === "attempts") {
            errorMsg.innerHTML = error.response.data.message;
            errorMessageRef.current.style.top = "3rem";
            setTimeout(() => {
              errorMessageRef.current.style.top = "-15rem";
            }, 3000);
          } else {
            errorMsg.innerHTML = ``;
            errorMessageRef.current.style.top = "-15rem";
            if (
              !error.response.data.type &&
              error.response.data.success === false
            ) {
              errorMsg.innerHTML = error.response.data.message;
              errorMessageRef.current.style.top = "3rem";
              setTimeout(() => {
                errorMessageRef.current.style.top = "-15rem";
              }, 3000);
            } else {
              errorMsg.innerHTML = ``;
              errorMessageRef.current.style.top = "-15rem";
            }
          }
        });
    }
  };

  useEffect(() => {
    const token = Cookies.get("admin-token");
    const id = Cookies.get("admin-id");
    if (token) {
      navigate(`/home/authorized/${id}/dashboard`);
    }
  });
  
  return (
    <>
      <section className="login">
        <div className="popup-container" ref={errorMessageRef}>
          <div className="failure">
            <div className="icon">
              <MdIcons.MdError />
            </div>
            <div className="message" id="errorMsg"></div>
          </div>
        </div>
        <div className="login-card">
          <div className="login-title">Admin Login</div>
          <form className="form">
            <div className="flex-column">
              <label>Email </label>
            </div>
            <div className="inputForm" ref={emailContainerRef}>
              <svg
                height="20"
                viewBox="0 0 32 32"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_3" data-name="Layer 3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                </g>
              </svg>
              <input
                name="email"
                type="email"
                className="input"
                placeholder="Enter your Email"
                value={inpValue.email}
                onChange={inputValueOnChange}
              />
            </div>
            <p ref={emailInputErrorMessageRef} className="errorInfo"></p>

            <div className="flex-column">
              <label>Password </label>
            </div>
            <div className="inputForm" ref={passwordContainerRef}>
              <svg
                height="20"
                viewBox="-64 0 512 512"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
              </svg>
              <input
                name="password"
                ref={passwordInputRef}
                type="password"
                className="input"
                placeholder="Enter your Password"
                value={inpValue.password}
                onChange={inputValueOnChange}
              />

              <div
                className="eye"
                style={{
                  fontSize: "1.8rem",
                  display: "flex",
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
                onClick={togglePassword}
              >
                {hiddenPas ? <FaIcons.FaEye /> : <FaIcons.FaEyeSlash />}
              </div>
            </div>
            <p ref={passwordInputErrorMessageRef} className="errorInfo"></p>
            <button className="button-submit" onClick={loginOnClick}>
              {isLoading ? <ButtonLoader /> : "Log In "}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
