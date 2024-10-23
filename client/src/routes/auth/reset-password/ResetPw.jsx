import React, { useState } from "react";
import Navbar from "../../../components/Navbar";

export default function ResetPw(props) {
  const [details, setDetails] = useState({
    title: "Reset Password",
    message:
      "Please enter your valid email that is connected with your account for verification purpose",
    type: "email",
  });

  const EmailVerification = () => {
    return (
      <form action="">
        <div className="label">
          <input type="email" placeholder="example@gmail.com" />
          <p className="errorMessage"></p>
        </div>
        <div className="btns">
          <button>CANCEL</button>
          <button>VERIFY</button>
        </div>
      </form>
    );
  };
  return (
    <>
      <section className="resetPw auth">
        <div className="card">
          <div className="top-section-title">
            <h1>{details.title}</h1>
            <p>{details.message}</p>
          </div>
          <EmailVerification />
        </div>
      </section>
    </>
  );
}
