import React, { useRef, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import MainButtonLoader from "../../tools/MainButtonLoader";
import Cookies from "js-cookies";
import axios from "axios";
import ResetPw from "./reset-password/ResetPw";
export default function Signup() {
  let navigate = useNavigate();
  const [inpVal, setInpVal] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const errorNameRef = useRef(null);
  const errorEmailRef = useRef(null);
  const errorPasswordRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const errorPopup = useRef(null);

  const HOST = import.meta.env.VITE_HOST;
  const inpValOnChange = (e) => {
    const { name, value } = e.target;
    setInpVal({ ...inpVal, [name]: value });
  };

  const signup = () => {
    let isValid = true;
    const gmailRegx =
      /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/;
    const passwordRegx =
      /^(?=.*\d)(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])(?=.*[a-z])(?=.*[A-Z]).{5,20}$/;

    const validateField = (
      value,
      regex,
      fieldRef,
      errorMessage,
      minLength = 0
    ) => {
      if (value === "") {
        fieldRef.current.style.background = "rgb(255 0 0 / 19%)";
        fieldRef.current.style.border = ".15rem solid red";
        isValid = false;
        return "Input field must not be empty";
      } else if (value.length < minLength) {
        fieldRef.current.style.background = "rgb(255 0 0 / 19%)";
        fieldRef.current.style.border = ".15rem solid red";
        isValid = false;
        return errorMessage;
      } else if (regex && !regex.test(value)) {
        fieldRef.current.style.background = "rgb(255 0 0 / 19%)";
        fieldRef.current.style.border = ".15rem solid red";
        isValid = false;
        return errorMessage;
      } else {
        fieldRef.current.style.background = "transparent";
        fieldRef.current.style.border = ".1rem solid #565353";
        return "";
      }
    };

    let nameError = validateField(
      inpVal.name,
      null,
      nameRef,
      "Please enter a valid name (at least 2 letters)",
      2
    );
    let emailError = validateField(
      inpVal.email,
      gmailRegx,
      emailRef,
      "Please enter a valid email address"
    );
    let passwordError = validateField(
      inpVal.password,
      passwordRegx,
      passwordRef,
      "Password must be 6-20 characters long, with at least one uppercase letter and one special character."
    );

    errorNameRef.current.innerText = nameError;
    errorEmailRef.current.innerText = emailError;
    errorPasswordRef.current.innerText = passwordError;
    if (isValid) {
      setIsLoading(true);
      axios
        .post(`${HOST}/user/auth/signup`, {
          name: inpVal.name,
          email: inpVal.email,
          password: inpVal.password,
        })
        .then((response) => {
          if (response.data.success === true) {
            setIsLoading(false);
            errorPopup.current.style.top = "3rem";
            errorPopup.current.innerHTML = `
              <div style="background: #10B981;" class="error-card">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#ffffff" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
                </span>
                ${response.data.message}
              </div>
            `;
            setTimeout(() => {
              errorPopup.current.style.top = "-15rem";
            }, 3000);
            navigate(`/verification/${response.data.id}`);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response.data.type === "email") {
            emailRef.current.style.background = "rgb(255 0 0 / 19%)";
            emailRef.current.style.border = ".15rem solid red";
            errorEmailRef.current.innerText = error.response.data.message;
          } else {
            emailRef.current.style.background = "transparent";
            emailRef.current.style.border = ".1rem solid #565353";
            errorEmailRef.current.innerText = "";
          }
        });
    }
  };
  useEffect(() => {
    if (Cookies.getItem("user-token")) {
      navigate("/");
    }
  });
  return (
    <>
      <Navbar menuColor="#101010" post={"POST"} />
      <section className="signup auth">
        <div className="errorPopup" ref={errorPopup}></div>
        <div className="card">
          <div className="top-section-title">
            <h1>Create new account</h1>
            <p>Join Swipe 4 Jobs to explore jobs</p>
          </div>
          <form action="">
            <div className="name label">
              <label htmlFor="name">Full name</label>
              <input
                ref={nameRef}
                onChange={inpValOnChange}
                value={inpVal.name}
                name="name"
                type="text"
                id="name"
                placeholder="Enter your full name"
              />
              <p className="errorMessage" ref={errorNameRef}></p>
            </div>
            <div className="email label">
              <label htmlFor="email">Email</label>
              <input
                ref={emailRef}
                onChange={inpValOnChange}
                value={inpVal.email}
                type="email"
                name="email"
                placeholder="example@gmail.com"
              />
              <p className="errorMessage" ref={errorEmailRef}></p>
            </div>
            <div className="password label">
              <label htmlFor="password" className="password">
                Password
              </label>
              <input
                ref={passwordRef}
                onChange={inpValOnChange}
                value={inpVal.password}
                type="password"
                name="password"
                className="password"
                placeholder="Enter new password"
              />
              <p className="errorMessage" ref={errorPasswordRef}></p>
            </div>
            <button
              style={{ marginTop: "2rem" }}
              type="button"
              onClick={signup}
            >
              {isLoading && <MainButtonLoader />}
              {!isLoading && "Signup"}
            </button>
            <div className="no-account">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </section>
      {/* <ResetPw/> */}
    </>
  );
}
