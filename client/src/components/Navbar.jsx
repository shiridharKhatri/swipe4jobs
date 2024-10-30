import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CgIcons, ImIcons, Io5Icons } from "../assets/Icons/icons";
import Cookies from "js-cookies";
import Setting from "./Setting";
export default function Navbar(props) {
  const navLinks = useRef(null);
  let location = useLocation();
  const openMenuOnClick = () => {
    navLinks.current.style.right = "0";
  };

  const [isSettingOn, setIsSettingOn] = useState(false);
  const { id } = useParams();
  const closeNavLink = () => {
    navLinks.current.style.right = "-80rem";
  };

  return (
    <>
      <nav>
        <div className="search-bar"></div>
        <div className="navigation-links">
          <div className="menuOption">
            <button
              style={{ color: props.menuColor }}
              aria-label="menu popups when clicked"
              onClick={openMenuOnClick}
            >
              <CgIcons.CgMenuRight />
            </button>
          </div>
          <ul ref={navLinks}>
            <div className="crossBar" onClick={closeNavLink}>
              <ImIcons.ImCross />
            </div>
            <li>
              <Link
                style={
                  location.pathname === "/"
                    ? { color: "#101010" }
                    : { color: "rgb(127, 127, 127)" }
                }
                to="/"
              >
                Home
              </Link>
              {location.pathname === "/" ? <span></span> : ""}
            </li>
            <li>
              <Link
                style={
                  location.pathname === "/about-us"
                    ? { color: "#101010" }
                    : { color: "rgb(127, 127, 127)" }
                }
                to="/about-us"
              >
                About
              </Link>
              {location.pathname === "/about-us" ? <span></span> : ""}
            </li>
            <li>
              <Link
                style={
                  location.pathname === "/search-jobs"
                    ? { color: "#101010" }
                    : { color: "rgb(127, 127, 127)" }
                }
                to="/search-jobs"
              >
                Search
              </Link>
              {location.pathname === "/search-jobs" ||
              location.pathname === "/search-jobs/" ||
              location.pathname === `/search-jobs/${id}` ? (
                <span></span>
              ) : (
                ""
              )}
            </li>

            <li>
              <Link
                style={
                  location.pathname === "/post-jobs"
                    ? { color: "#101010" }
                    : { color: "rgb(127, 127, 127)" }
                }
                to="/post-jobs"
              >
                Post
              </Link>
              {location.pathname === "/post-jobs" ? <span></span> : ""}
            </li>

            {!Cookies.getItem("user-token") && (
              <li>
                <Link to="/login" id="loginButton">
                  Login
                </Link>
              </li>
            )}
            {Cookies.getItem("user-token") && (
              <li
                onClick={closeNavLink}
                className="profile"
                style={{ position: "relative" }}
              >
                <div id="profileButton" onClick={() => setIsSettingOn(true)}>
                  Profile
                </div>
              </li>
            )}
          </ul>
        </div>
      </nav>
      {isSettingOn && <Setting setIsSettingOn={setIsSettingOn} />}
    </>
  );
}
