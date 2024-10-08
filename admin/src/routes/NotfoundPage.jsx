import React from "react";
import { Fa6icons } from "../assets/Icons/icons";
import { useNavigate } from "react-router-dom";
export default function NotfoundPage(props) {
  const navigate = useNavigate();
  return (
    <>
      <section className="notFound">
        <div className="text">404</div>
        <div className="details">
          <h3>
            Oops! The page you're looking for doesn't exist or may be under
            construction.
          </h3>
          {props.isVisible && (
            <button
              aria-label="go back button"
              onClick={() => {
                navigate("/");
              }}
            >
              <span className="goBackArrow">
                <Fa6icons.FaChevronLeft />
              </span>
              <span className="goBackText">Login</span>
            </button>
          )}
        </div>
      </section>
    </>
  );
}
