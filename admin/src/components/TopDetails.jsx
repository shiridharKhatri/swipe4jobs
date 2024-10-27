import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { HiIcons } from "../assets/Icons/icons";
export default function TopDetails(props) {
  const navigation = useNavigate();
  const logout = () => {
    Cookies.remove("admin-token");
    Cookies.remove("admin-id");
    navigation("/");
  };
  const menuOnClick = () => {
    props.navbar.current.style.left = "0";
  };
  return (
    <div className="header">
      <div className="title">{props.title}</div>
      <div className="logout menu buttons">
        <button onClick={logout}>Logout</button>
        <button className="mobile" onClick={menuOnClick}>
          <HiIcons.HiMenuAlt3 />
        </button>
      </div>
    </div>
  );
}
