import React, { useEffect, useRef } from "react";
import {
  FaIcons,
  Hi2Icons,
  Io5Icons,
  IoIcons,
  MdIcons,
  RiIcons,
} from "../assets/Icons/icons";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import NotfoundPage from "./NotfoundPage";
import Dashboard from "../components/Dashboard";
import Mpost from "../components/Mpost";
import Madmin from "../components/Madmin";
import Setting from "../components/Setting";
import Muser from "../components/Muser";
import Mpayment from "../components/Mpayment";
import { useContext } from "react";
import { Context } from "../context/Context";

export default function Home() {
  const {
    fetchOveriew,
    fetchJobs,
    handelPostAction,
    handelJobPosting,
    fetchAllAdmin,
  } = useContext(Context);

  const navContainerRef = useRef(null);
  const { id, routes } = useParams();
  let token = Cookies.get("admin-token");
  useEffect(() => {
    window.document.title = `Swipe4Jobs | Admin | ${routes}`;
  });
  const closeNav = () => {
    navContainerRef.current.style.left = "-40rem";
  };
  // useEffect(() => {
  //   fetchJobs().then((res) => {
  //     console.log(res);
  //   });
  // }, [fetchJobs]);
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
              </div>
              <div className="close" onClick={closeNav}>
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
              <Dashboard
                fetchOveriew={fetchOveriew}
                navContainerRef={navContainerRef}
              />
            ) : routes === "manage-post" ? (
              <Mpost
                handelPostAction={handelPostAction}
                fetchJobs={fetchJobs}
                handelJobPosting={handelJobPosting}
                navContainerRef={navContainerRef}
              />
            ) : routes === "manage-admin" ? (
              <Madmin
                fetchAllAdmin={fetchAllAdmin}
                id={id}
                navContainerRef={navContainerRef}
              />
            ) : routes === "setting" ? (
              <Setting navContainerRef={navContainerRef} />
            ) : routes === "manage-users" ? (
              <Muser navContainerRef={navContainerRef} />
            ) : routes === "manage-payment" ? (
              <Mpayment navContainerRef={navContainerRef} />
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
