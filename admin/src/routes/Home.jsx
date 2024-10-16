import React, { useEffect, useRef } from "react";
import {
  FaIcons,
  Hi2Icons,
  Io5Icons,
  IoIcons,
  MdIcons,
  RiIcons,
} from "../assets/Icons/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NotfoundPage from "./NotfoundPage";
import Dashboard from "../components/Dashboard";
import Mpost from "../components/Mpost";
import Madmin from "../components/Madmin";
import Analytics from "../components/Analytics";
import Setting from "../components/Setting";
import axios from "axios";
import Muser from "../components/Muser";
import Mpayment from "../components/Mpayment";

export default function Home() {
  const navContainerRef = useRef(null);
  const { id, routes } = useParams();
  let token = Cookies.get("token");
  useEffect(() => {
    window.document.title = `Career Salient | Admin | ${routes}`;
  });
  return (
    <>
      {!token && <NotfoundPage isVisible={true} />}
      {token && (
        <section className="home">
          <div className="mobile-visible"></div>
          <div className="firstContainer nav" ref={navContainerRef}>
            <div className="header">
              <div style={{ display: "flex" }} className="head-logo">
                <img src="/favicon.svg" alt="logo" />
                <span>alient</span>
              </div>
              <div className="close">
                <Io5Icons.IoCloseSharp />
              </div>
            </div>
            <ul>
              <li>
                <Link
                  style={
                    routes === "dashboard"
                      ? { background: "rgb(60 73 92)" }
                      : { background: "transparent" }
                  }
                  to={`/home/authorized/${id}/dashboard`}
                >
                  <span>
                    <MdIcons.MdDashboard />
                  </span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  style={
                    routes === "manage-post"
                      ? { background: "rgb(60 73 92)" }
                      : { background: "transparent" }
                  }
                  to={`/home/authorized/${id}/manage-post`}
                >
                  <span>
                    <FaIcons.FaEdit />
                  </span>
                  Manage post
                </Link>
              </li>
              <li>
                <Link
                  style={
                    routes === "manage-admin"
                      ? { background: "rgb(60 73 92)" }
                      : { background: "transparent" }
                  }
                  to={`/home/authorized/${id}/manage-admin`}
                >
                  <span>
                    <MdIcons.MdAdminPanelSettings />
                  </span>
                  Manage Admin
                </Link>
              </li>
              <li>
                <Link
                  style={
                    routes === "manage-users"
                      ? { background: "rgb(60 73 92)" }
                      : { background: "transparent" }
                  }
                  to={`/home/authorized/${id}/manage-users`}
                >
                  <span>
                    <Hi2Icons.HiUsers />
                  </span>
                  Manage Users
                </Link>
              </li>
              <li>
                <Link
                  style={
                    routes === "manage-payment"
                      ? { background: "rgb(60 73 92)" }
                      : { background: "transparent" }
                  }
                  to={`/home/authorized/${id}/manage-payment`}
                >
                  <span>
                    <RiIcons.RiMoneyDollarCircleFill />
                  </span>
                  Manage Payment
                </Link>
              </li>
              <li>
                <Link
                  style={
                    routes === "analytics"
                      ? { background: "rgb(60 73 92)" }
                      : { background: "transparent" }
                  }
                  to={`/home/authorized/${id}/analytics`}
                >
                  <span>
                    <MdIcons.MdAnalytics />
                  </span>
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  style={
                    routes === "setting"
                      ? { background: "rgb(60 73 92)" }
                      : { background: "transparent" }
                  }
                  to={`/home/authorized/${id}/setting`}
                >
                  <span>
                    <Io5Icons.IoSettingsSharp />
                  </span>
                  Setting
                </Link>
              </li>
            </ul>
          </div>
          <div className="secondContainer">
            {routes === "dashboard" ? (
              <Dashboard navContainerRef={navContainerRef} />
            ) : routes === "manage-post" ? (
              <Mpost navContainerRef={navContainerRef} />
            ) : routes === "manage-admin" ? (
              <Madmin id={id} navContainerRef={navContainerRef} />
            ) : routes === "analytics" ? (
              <Analytics navContainerRef={navContainerRef} />
            ) : routes === "setting" ? (
              <Setting navContainerRef={navContainerRef} />
            ) : routes === "manage-users" ? (
              <Muser />
            ) : routes === "manage-payment" ? (
              <Mpayment />
            ) : (
              <NotfoundPage
                isVisible={false}
                navContainerRef={navContainerRef}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
}
