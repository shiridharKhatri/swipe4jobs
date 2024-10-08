import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { HiIcons, Io5Icons } from "../assets/Icons/icons";
export default function TopDetails(props) {
  const navigation = useNavigate();
  const [isMenuOn, setIsMenuOn] = useState(false);
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("id");
    navigation("/");
  };
  const menuOnClick = () => {
    if (isMenuOn) {
      setIsMenuOn(false);
      props.navbar.current.style.left = "-40rem";
    } else {
      setIsMenuOn(true);
      props.navbar.current.style.left = "0";
    }
  };
  return (
    <div className="header">
      <div className="title">{props.title}</div>
      <div className="logout menu buttons">
        <button onClick={logout}>Logout</button>
        <button className="mobile" onClick={menuOnClick}>
          {isMenuOn ? <Io5Icons.IoCloseSharp /> : <HiIcons.HiMenuAlt3 />}
        </button>
      </div>
    </div>
  );
}
