import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
export default function Verification() {
  let navigate = useNavigate();
  let { id } = useParams();
  const HOST = import.meta.env.VITE_HOST;
  const [code, setCode] = useState("");
  let errorCodeRef = useRef(null);
  let codeRef = useRef(null);
  let errorPopup = useRef(null);
  const codeOnChange = (e) => {
    setCode(e.target.value);
  };
  const submitCodeOnClick = () => {
    let isValid = true;
    if (code === "") {
      errorCodeRef.current.innerText = "Code field must not be empty";
      codeRef.current.style.background = "rgb(255 0 0 / 19%)";
      codeRef.current.style.border = ".15rem solid red";
      isValid = false;
    } else if (code.length < 6) {
      errorCodeRef.current.innerText = "Please enter valid six digit code";
      codeRef.current.style.background = "rgb(255 0 0 / 19%)";
      codeRef.current.style.border = ".15rem solid red";
      isValid = false;
    } else {
      errorCodeRef.current.innerText = "";
      codeRef.current.style.background = "transparent";
      codeRef.current.style.border = ".1rem solid #565353";
    }
    if (isValid) {
      axios
        .post(`${HOST}/user/auth/verification/${id}`, {
          code: code,
        })
        .then((response) => {
          if (response.data.success === true) {
            errorPopup.current.style.top = "3rem";
            errorPopup.current.innerHTML = `
            <div  style="background: #10B981;" class="error-card">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#ffffff" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
              </span>
              ${response.data.message}
            </div>
          `;
            setTimeout(() => {
              errorPopup.current.style.top = "-15rem";
            }, 3000);
            navigate("/login");
          }
        })
        .catch((error) => {
          if (error.status === 403) {
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
          } else if (error.status === 409) {
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

  return (
    <>
      <Navbar />
      <section className="auth verification">
        <div className="errorPopup" ref={errorPopup}></div>
        <div className="card">
          <div className="top-section-title">
            <h1>Verification</h1>
            <p>
              A verification code has been sent to your email. If you don't see
              it, please check your spam folder.
            </p>
          </div>
          <form action="">
            <div className="label">
              <input
                type="text"
                maxLength={6}
                onChange={codeOnChange}
                value={code}
                ref={codeRef}
                placeholder="Enter six digit code "
              />
              <p className="errorMessage" ref={errorCodeRef}></p>
            </div>
            <div className="btns">
              <button onClick={() => navigate("/")}>Cancel</button>
              <button type="button" onClick={submitCodeOnClick}>
                Verify
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
