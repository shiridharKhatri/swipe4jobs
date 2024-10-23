import React from "react";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
import "../../styles/component/Status.css";
import { MdIcons, RxIcons } from "../../assets/Icons/icons";
export default function Status() {
  const { status } = useParams();
  return (
    <>
      <Navbar />
      <section className="status">
        <div className="container">
          {status.toLowerCase() === "success" && (
            <div className="card">
              <button className="dismiss" type="button">
                <RxIcons.RxCross2 />
              </button>
              <div className="header">
                <div className="main-container">
                  <div className="check-container">
                    <div className="check-background">
                      <svg
                        viewBox="0 0 65 51"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 25L27.3077 44L58.5 7"
                          stroke="white"
                          stroke-width="13"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="check-shadow"></div>
                  </div>
                </div>
                <div className="content">
                  <span className="title">Purchase Success</span>
                  <p className="message">
                    Search limit has been purchased successfully! You can now
                    enjoy enhanced access to our services. Thank you for
                    choosing us!
                  </p>
                </div>
                <div className="actions">
                  <button className="history" type="button">
                    Go back home
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Failure purchase */}
          {status.toLowerCase() === "failed" && (
            <div className="card">
              <button className="dismiss" type="button">
                <RxIcons.RxCross2 />
              </button>
              <div className="header">
                <div
                  style={{
                    background: "#FEE2E2",
                    color: "#DC2626",
                    fontSize: "3rem",
                  }}
                  className="image"
                >
                  <RxIcons.RxCross2 />
                </div>
                <div className="content">
                  <span className="title" style={{ color: "#DC2626" }}>
                    Purchase failed
                  </span>
                  <p className="message">
                    Unfortunately, your purchase couldn't be completed. Please
                    check your payment and try again, or contact support if
                    needed.
                  </p>
                </div>
                <div className="actions">
                  <button
                    style={{ background: "#DC2626" }}
                    className="history"
                    type="button"
                  >
                    Go back home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
