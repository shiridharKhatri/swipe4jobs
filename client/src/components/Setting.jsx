import React, { useState, useEffect, useContext } from "react";
import "../styles/component/Setting.css";
import { BsIcons, ImIcons, MdIcons } from "../assets/Icons/icons";
import Cookies from "js-cookies";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
export default function Setting(props) {
  let navigate = useNavigate();
  const HOST = import.meta.env.VITE_HOST;
  const [navigation, setNavigation] = useState("profile");
  const { fetchUser } = useContext(Context);
  let [paymentData, setPamentData] = useState([]);
  const [user, setUser] = useState({});
  const valueOnClick = (e) => {
    setNavigation(e);
  };
  const logoutOnClick = () => {
    navigate("/");
    Cookies.removeItem("token");
    Cookies.removeItem("id");
    props.setIsSettingOn(false);
  };

  const fetchPayment = async () => {
    axios
      .get(`${HOST}/api/payment/details/history/${Cookies.getItem("id")}`, {
        headers: {
          "auth-token": Cookies.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setPamentData(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchPayment();
  }, []);
  useEffect(() => {
    fetchUser().then((res) => {
      if (res.success === true) {
        setUser(res.user);
      }
    });
  }, [fetchUser]);

  return (
    <section className="setting">
      <div className="container">
        <div className="first-nav-section">
          <ul>
            <li
              onClick={() => valueOnClick("profile")}
              style={
                navigation === "profile"
                  ? { background: "#4a4a4b" }
                  : { background: "transparent" }
              }
            >
              Profile
            </li>
            <li
              onClick={() => valueOnClick("payment")}
              style={
                navigation === "payment"
                  ? { background: "#4a4a4b" }
                  : { background: "transparent" }
              }
            >
              Payment History
            </li>
            <li
              onClick={() => valueOnClick("postings")}
              style={
                navigation === "postings"
                  ? { background: "#4a4a4b" }
                  : { background: "transparent" }
              }
            >
              Postings
            </li>
            <li
              onClick={() => valueOnClick("setting")}
              style={
                navigation === "setting"
                  ? { background: "#4a4a4b" }
                  : { background: "transparent" }
              }
            >
              Setting
            </li>
          </ul>
          <div id="logout" onClick={logoutOnClick}>
            Logout
          </div>
        </div>
        <div className="second-nav-section">
          <div className="header">
            <h2>{navigation.toUpperCase()}</h2>
            <div
              onClick={() => props.setIsSettingOn(false)}
              className="cross-icon"
            >
              <ImIcons.ImCross />
            </div>
          </div>
          {navigation === "profile" ? (
            <div className="body-sec">
              <div className="top">
                <img
                  src="https://ui-avatars.com/api/?name=Shiridhar khatri&bold=true&background=%23ffffff&uppercase=true&format=svg"
                  alt="avatar"
                />
                <div className="details">
                  <div className="name">{user?.name}</div>
                  <div className="mail">{user?.email}</div>
                </div>
              </div>
              <div className="middle">
                <div className="id item">
                  <h3>User id :</h3>
                  <p>{user?._id}</p>
                </div>
                <div className="createdDate item">
                  <h3>Account created date :</h3>
                  <p>{user?.accountCreatedDate}</p>
                </div>
                <div className="searchLimit item">
                  <h3>Search limit :</h3>
                  <p>{user?.search_limit}</p>
                </div>
                <div className="jobPosted item">
                  <h3>Total job posted :</h3>
                  <p>{user?.job_posted}</p>
                </div>
              </div>
            </div>
          ) : navigation === "payment" ? (
            <>
              {!paymentData || paymentData?.length <= 0 ? (
                <div className="body-sec noPay">
                  <div className="ico">
                    <BsIcons.BsClockHistory />
                  </div>
                  <div className="par">No payment has been made so far.</div>
                </div>
              ) : (
                <div className="body-sec">
                  {paymentData?.map((e) => {
                    return (
                      <div key={e._id} className="card-section">
                        <div className="item">
                          <p>Payment ID</p>
                          <h3>{e.payment_id}</h3>
                        </div>
                        <div className="item">
                          <p>Payment Method</p>
                          <h3>{e.paymentMethod}</h3>
                        </div>
                        <div className="item">
                          <p>Paid for</p>
                          <h3>
                            {e.serviceType} (+{e.search_limit})
                          </h3>
                        </div>
                        <div className="item">
                          <p>Amount paid</p>
                          <h3>${e.amount}</h3>
                        </div>
                        <button>
                          <MdIcons.MdOutlineFileDownload />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : navigation === "postings" ? (
            <div className="body-sec">
              <div className="postContainer">
                <div className="card">
                  <div className="first">
                    <img
                      src="/company-image/betterBuilders.png"
                      alt="better builders"
                    />
                    <div className="details">
                      <div className="title">Gables Accounting</div>
                      <div className="code">Code : 456</div>
                      <div className="date">
                        Posted on : September 27th 2024, 2:41:59 pm
                      </div>
                      <div className="overview">
                        Instructors wanted with advanced math skills
                      </div>
                    </div>
                  </div>
                  <div className="second">Delete</div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
}
