import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CgIcons, ImIcons, Io5Icons } from "../assets/Icons/icons";
import Cookies from "js-cookies";
import { Context } from "../context/Context";
export default function Navbar() {
  const { fetchUser } = useContext(Context);
  const navigate = useNavigate();
  const navLinks = useRef(null);
  let location = useLocation();
  const openMenuOnClick = () => {
    navLinks.current.style.transform = "scale(1)";
  };
  const [user, setUser] = useState({});
  const { id } = useParams();
  const closeNavLink = () => {
    navLinks.current.style.transform = "scale(0)";
  };
  const logoutOnClick = () => {
    navigate("/");
    Cookies.removeItem("token");
    Cookies.removeItem("id");
  };

  useEffect(() => {
    fetchUser()
      .then((res) => {
        if (res.success === true) {
          setUser(res.user);
        }
      })
  }, [fetchUser]);
  return (
    <nav>
      <div className="search-bar"></div>
      <div className="navigation-links">
        <div className="menuOption">
          <button
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
              Trending
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
          {!Cookies.getItem("token") && (
            <li>
              <Link to="/login" id="loginButton">
                Login
              </Link>
            </li>
          )}
          {Cookies.getItem("token") && (
            <li className="profile" style={{ position: "relative" }}>
              <div id="profileButton">Profile</div>

             {!user && <div className="tooltipProfile">
                <div className="nameSetting nameSetting-loader">
                  <div style={{width:"100%"}}>
                    <div className="name-loader"></div>
                    <div className="email-loader"></div>
                  </div>
                  <div className="setting-loader"></div>
                </div>
                <button onClick={logoutOnClick}>Logout</button>
              </div>}
             { user && <div className="tooltipProfile">
                <div className="nameSetting">
                  <div>
                    {" "}
                    <div className="name">{user.name}</div>{" "}
                    <div className="email">{user.email}</div>
                  </div>

                  <div className="setting">
                    <Io5Icons.IoSettingsSharp />
                  </div>
                </div>

                <button onClick={logoutOnClick}>Logout</button>
              </div>}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
