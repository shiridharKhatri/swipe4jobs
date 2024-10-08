import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../components/Loader";
import NotfoundPage from "./NotfoundPage";
import { MdIcons } from "../assets/Icons/icons";
export default function Verification() {
  const { id } = useParams();
  const codeInputErrorMessageRef = useRef(null);
  const codeContainerRef = useRef(null);
  const errorMessageRef = useRef(null);
  const [codeVal, setCodeVal] = useState("");
  const [adminDetail, setAdminDetail] = useState({ id: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_HOST;
  const codeValueOnChange = (e) => {
    setCodeVal(e.target.value);
  };
  const verifyOnClick = (e) => {
    e.preventDefault();
    let isValid = true;
    if (String(codeVal).length <= 0) {
      codeInputErrorMessageRef.current.innerText = `Code filed must not be empty`;
      codeContainerRef.current.style.background = "#ff000036";
      codeContainerRef.current.style.border = ".15rem solid #ee0000";
      isValid = false;
      return;
    } else {
      codeInputErrorMessageRef.current.innerText = ``;
      codeContainerRef.current.style.background = "transparent";
      codeContainerRef.current.style.border = ".15rem solid #d8dcd8";
      if (String(codeVal).length < 6 || String(codeVal).length > 6) {
        codeInputErrorMessageRef.current.innerText = `Please enter valid six digit code`;
        codeContainerRef.current.style.background = "#ff000036";
        codeContainerRef.current.style.border = ".15rem solid #ee0000";
        isValid = false;
        return;
      } else {
        codeInputErrorMessageRef.current.innerText = ``;
        codeContainerRef.current.style.background = "transparent";
        codeContainerRef.current.style.border = ".15rem solid #d8dcd8";
      }
    }
    if (isValid) {
      axios
        .post(`${url}/auth/admin/existing/access/verification/${id}`, {
          code: Number(codeVal),
        })
        .then((res) => {
          Cookies.set("token", res.data.token, { expires: 7 });
          Cookies.set("id", id);
          navigate(`/home/authorized/${id}/dashboard`);
        })
        .catch((error) => {
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
    setIsLoading(true);
    const fetchAdminById = () => {
      axios
        .post(`${url}/auth/admin/existing/access/fetch/${id}`)
        .then((res) => {
          setIsLoading(false);
          setAdminDetail({ id: res.data.id, email: res.data.email });
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    };
    fetchAdminById();
  }, []);
  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          {id !== adminDetail.id ? (
            <NotfoundPage isVisible={true} />
          ) : (
            <section className="verification">
              <div className="popup-container" ref={errorMessageRef}>
                <div className="failure">
                  <div className="icon">
                    <MdIcons.MdError />
                  </div>
                  <div className="message" id="errorMsg"></div>
                </div>
              </div>
              <div className="verification-card">
                <div className="verification-title">
                  <div className="header"> Admin Verification</div>
                  <div className="text">
                    Hey Admin, welcome back! To proceed to the dashboard, please
                    enter the six-digit code sent to your email address (
                    <span>{adminDetail.email}</span>). If you can't find the
                    email, kindly check your spam folder
                  </div>
                </div>
                <form action="">
                  <div className="input" ref={codeContainerRef}>
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
                      value={codeVal}
                      onChange={codeValueOnChange}
                      name="code"
                      type="number"
                      className="code"
                      placeholder="Enter six digit code"
                      maxLength={6}
                    />
                  </div>
                  <p ref={codeInputErrorMessageRef} className="errorInfo"></p>
                  <div className="btns">
                    <button
                      type="button"
                      onClick={() => navigate("/secure/admin/login")}
                    >
                      CANCEL
                    </button>
                    <button type="submit" onClick={verifyOnClick}>
                      VERIFY
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
