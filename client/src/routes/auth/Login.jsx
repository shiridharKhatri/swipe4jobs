import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookies";
import axios from "axios";
import ButtonLoader from "../../tools/ButtonLoader";
export default function Login() {
  const [inpVal, setInpVal] = useState({ email: "", password: "" });
  const [remeberMeChecked, setRememberMeChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const HOST = import.meta.env.VITE_HOST;
  let navigate = useNavigate();
  let errorEmailRef = useRef(null);
  let errorPasswordRef = useRef(null);
  let emailRef = useRef(null);
  let passwordRef = useRef(null);
  const errorPopup = useRef(null);
  const rememberMe = (e) => {
    setRememberMeChecked(e.target.checked);
  };
  const inpValOnChange = (e) => {
    const { name, value } = e.target;
    setInpVal({ ...inpVal, [name]: value });
  };
  const loginOnClick = () => {
    let isValid = true;
    const emailRegx =
      /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/;
    const passwordRegx =
      /^(?=.*\d)(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])(?=.*[a-z])(?=.*[A-Z]).{5,20}$/;
    const validationCheck = (value, inputRef, errorMessage, regxVal) => {
      if (value === "") {
        inputRef.current.style.background = "rgb(255 0 0 / 19%)";
        inputRef.current.style.border = ".15rem solid red";
        isValid = false;
        return "Input field must not be empty";
      } else if (value.length < 2) {
        inputRef.current.style.background = "rgb(255 0 0 / 19%)";
        inputRef.current.style.border = ".15rem solid red";
        isValid = false;
        return errorMessage;
      } else if (!regxVal.test(value)) {
        inputRef.current.style.background = "rgb(255 0 0 / 19%)";
        inputRef.current.style.border = ".15rem solid red";
        isValid = false;
        return errorMessage;
      } else {
        inputRef.current.style.background = "transparent";
        inputRef.current.style.border = ".1rem solid #565353";
        return " ";
      }
    };

    let emailVal = validationCheck(
      inpVal.email,
      emailRef,
      "Please enter a valid email address",
      emailRegx
    );
    let passwordVal = validationCheck(
      inpVal.password,
      passwordRef,
      "Please enter a valid password",
      passwordRegx
    );

    errorEmailRef.current.innerText = emailVal;
    errorPasswordRef.current.innerText = passwordVal;
    if (isValid) {
      setIsLoading(true);
      axios
        .post(`${HOST}/user/auth/login`, {
          email: inpVal.email,
          password: inpVal.password,
        })
        .then((response) => {
          if (response.data.success === true) {
            setIsLoading(false);
            Cookies.setItem("user-token", response.data.token);
            Cookies.setItem("user-id", response.data.id);
            navigate("/");
            window.location.reload();
          }
        })
        .catch((error) => {
          setIsLoading(false);
          if (
            error.status === 403 &&
            error.response.data.type === "verification"
          ) {
            navigate(`/verification/${error.response.data.id}`);
          } else if (
            error.status === 401 &&
            error.response.data.success === false
          ) {
            errorPopup.current.style.top = "3rem";
            errorPopup.current.innerHTML = `
              <div class="error-card">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#ffffff" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
                </span>
                ${error.response.data.message}
              </div>
            `;
            setTimeout(() => {
              errorPopup.current.style.top = "-15rem";
            }, 3000);
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
      <Navbar menuColor="#101010" />
      <section className="login auth">
        <div className="errorPopup" ref={errorPopup}></div>
        <div className="card">
          <div className="top-section-title">
            <h1>Welcome back!</h1>
            <p>Login to your account</p>
          </div>

          <form action="">
            <div className="email label">
              <label htmlFor="email">Email</label>
              <input
                ref={emailRef}
                onChange={inpValOnChange}
                value={inpVal.email}
                name="email"
                type="email"
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
                placeholder="Enter your password"
              />
              <p className="errorMessage" ref={errorPasswordRef}></p>
            </div>
            <div className="remember">
              <input
                onChange={rememberMe}
                type="checkbox"
                id="remember"
                hidden
              />
              <label htmlFor="remember" className="rememberMe">
                <span
                  style={
                    remeberMeChecked
                      ? { background: "#101010" }
                      : { background: "transparent" }
                  }
                  className="checkIcon"
                ></span>
                Remember me
              </label>
              <a href="">Forget password?</a>
            </div>
            <button type="button" onClick={loginOnClick}>
              {isLoading && <ButtonLoader />}
              {!isLoading && "Login"}
            </button>
            <div className="no-account">
              Don't have an account? <Link to="/signup">Signup</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
