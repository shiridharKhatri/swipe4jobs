import React, { useState, useEffect, useContext, useRef } from "react";
import "../styles/component/Setting.css";
import { BsIcons, ImIcons, MdIcons, TbIcons } from "../assets/Icons/icons";
import Cookies from "js-cookies";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
import MainButtonLoader from "../tools/MainButtonLoader";
import ButtonLoader from "../tools/ButtonLoader";
import Popup from "../tools/Popup";
export default function Setting(props) {
  let navigate = useNavigate();
  const HOST = import.meta.env.VITE_HOST;
  const TOKEN = Cookies.getItem("user-token");
  const ID = Cookies.getItem("user-id");
  const [navigation, setNavigation] = useState("profile");
  const [isPopupCancel, setIsPopupCancel] = useState(true);
  const [isChangePwRunning, setIsChangePwRunning] = useState(false);
  const { fetchUser, fetchUserPost } = useContext(Context);
  const [postdata, setPostData] = useState({ data: [], success: false });
  let [paymentData, setPamentData] = useState({ data: [], success: false });
  const [user, setUser] = useState({ user: {}, success: false });
  const [loader, setLoader] = useState({ deleteConfirmation: false });

  const valueOnClick = (e) => {
    setNavigation(e);
  };
  const logoutOnClick = () => {
    navigate("/");
    Cookies.removeItem("user-token");
    Cookies.removeItem("user-id");
    props.setIsSettingOn(false);
  };

  const confirmDeleteAccount = () => {
    setLoader((prev) => ({ ...prev, deleteConfirmation: true }));
    axios
      .delete(`${HOST}/user/auth/user/remove/${ID}`, {
        headers: {
          "auth-token": TOKEN,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setLoader((prev) => ({ ...prev, deleteConfirmation: false }));
          logoutOnClick();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ConfirmationPopup = (props) => {
    return (
      <div className="confirmBox">
        <div className="cardBox">
          <h1>{props.title}</h1>
          <p>{props.details}</p>
          <div className="btns">
            <button onClick={() => setIsPopupCancel(true)}>CANCEL</button>
            <button onClick={confirmDeleteAccount}>
              {loader.deleteConfirmation ? <ButtonLoader /> : "CONFIRM"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ChangePasswordPopup = (props) => {
    const [passwordVal, setPasswordVal] = useState({
      password: "",
      newPassword: "",
      rePassword: "",
    });

    const passwordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const rePasswordRef = useRef(null);

    const passwordErrorRef = useRef(null);
    const newPasswordErrorRef = useRef(null);
    const rePasswordErrorRef = useRef(null);
    const passwordValOnChange = (e) => {
      const { name, value } = e.target;
      setPasswordVal({ ...passwordVal, [name]: value });
    };

    const showPasswordOnChange = (e) => {
      if (e.target.checked) {
        passwordRef.current.type = "text";
        newPasswordRef.current.type = "text";
        rePasswordRef.current.type = "text";
      } else {
        passwordRef.current.type = "password";
        newPasswordRef.current.type = "password";
        rePasswordRef.current.type = "password";
      }
    };

    const changePasswordOnClick = () => {
      const passwordRegx =
        /^(?=.*\d)(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])(?=.*[a-z])(?=.*[A-Z]).{5,20}$/;
      let isValidate = true;
      let validation = (value, input, regex, message) => {
        if (value === "") {
          input.current.style.border = `.15rem solid red`;
          isValidate = false;
          return "Input field must not be empty";
        } else if (regex && !regex.test(value)) {
          input.current.style.border = `.15rem solid red`;
          isValidate = false;
          return message;
        } else {
          input.current.style.border = ".15rem solid rgb(202, 202, 215)";
          return "";
        }
      };
      let passwordValidate = validation(
        passwordVal.password,
        passwordRef,
        null,
        ""
      );
      let newPasswordValidate = validation(
        passwordVal.newPassword,
        newPasswordRef,
        passwordRegx,
        "Password must be 6-20 characters long, with at least one uppercase letter and one special character."
      );
      let rePasswordValidate = validation(
        passwordVal.rePassword,
        rePasswordRef,
        null,
        ""
      );

      passwordErrorRef.current.innerText = passwordValidate;
      newPasswordErrorRef.current.innerText = newPasswordValidate;
      rePasswordErrorRef.current.innerText = rePasswordValidate;

      if (isValidate) {
        let popupSec = document.getElementById("popup-message");
        if (passwordVal.newPassword !== passwordVal.rePassword) {
          isValidate = false;
          rePasswordRef.current.style.border = `.15rem solid red`;
          rePasswordErrorRef.current.innerText =
            "New password and confirm password doesn't match";
        } else {
          rePasswordRef.current.style.border = `.15rem solid rgb(202, 202, 215)`;
          rePasswordErrorRef.current.innerText = "";
          axios
            .post(
              `${HOST}/user/auth/change/password/${ID}`,
              {
                password: passwordVal.password,
                newPassword: passwordVal.newPassword,
              },
              {
                headers: {
                  "auth-token": TOKEN,
                },
              }
            )
            .then((res) => {
              if (res.data.success) {
                props.popup(false);
                popupSec.style.top = "2rem";
                setTimeout(() => {
                  popupSec.style.top = "-10rem";
                }, 3000);
              }
            })
            .catch((err) => {
              if (err.status === 401 && err.response.data.type === "password") {
                passwordRef.current.style.border = `.15rem solid red`;
                passwordErrorRef.current.innerText = err.response.data.message;
              } else {
                passwordRef.current.style.border = `.15rem solid rgb(202, 202, 215)`;
                passwordErrorRef.current.innerText = "";
              }
            });
        }
      }
    };

    return (
      <div className="confirmBox changePassword">
        <div className="cardBox">
          <h1>{props.title}</h1>
          <p>{props.details}</p>
          <form>
            <input
              ref={passwordRef}
              onChange={passwordValOnChange}
              value={passwordVal.password}
              type="password"
              name="password"
              placeholder="Enter current password"
            />
            <div ref={passwordErrorRef} className="errorMessage"></div>
            <input
              ref={newPasswordRef}
              onChange={passwordValOnChange}
              value={passwordVal.newPassword}
              type="password"
              name="newPassword"
              placeholder="Enter new password"
            />
            <div ref={newPasswordErrorRef} className="errorMessage"></div>
            <input
              ref={rePasswordRef}
              onChange={passwordValOnChange}
              value={passwordVal.rePassword}
              type="password"
              name="rePassword"
              placeholder="Re-enter new password"
            />
            <div ref={rePasswordErrorRef} className="errorMessage"></div>
          </form>
          <div className="showPasSec">
            <input
              onChange={showPasswordOnChange}
              type="checkbox"
              id="showPas"
            />
            <label htmlFor="showPas">Show all password</label>
          </div>
          <div className="btns">
            <button onClick={() => setIsChangePwRunning(false)}>CANCEL</button>
            <button onClick={changePasswordOnClick}>
              {loader.deleteConfirmation ? <ButtonLoader /> : "CONFIRM"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fetchPayment = async () => {
    axios
      .get(`${HOST}/api/payment/details/history/${ID}`, {
        headers: {
          "auth-token": TOKEN,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setPamentData({ data: res.data.data, success: true });
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
    try {
      fetchUserPost().then((res) => {
        if (res && res.success === true) {
          setPostData({ data: res.post, success: true });
        } else {
          console.log("Error: Data not available");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [fetchUserPost]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchUser();
        if (res && res.success === true) {
          setUser({ user: res.user, success: true });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [fetchUser]);
  return (
    <section className="setting">
      <Popup
        background="#1aa06d"
        message="Your password has been successfully changed."
      />
      <div className="container">
        {isChangePwRunning && (
          <ChangePasswordPopup
            popup={setIsChangePwRunning}
            title={"Change password"}
            details={
              "To update your password, please enter your current password along with the new one."
            }
          />
        )}
        {!isPopupCancel && (
          <ConfirmationPopup
            title={"Delete confirmation"}
            details={
              "Are you sure you want to delete your account? This action cannot be undone, and all of your data will be permanently removed and unrecoverable."
            }
          />
        )}
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
              {!user.success && (
                <div
                  className="loader"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MainButtonLoader />
                </div>
              )}
              {user.success && (
                <>
                  {" "}
                  <div className="top">
                    <img
                      src="https://ui-avatars.com/api/?name=Shiridhar khatri&bold=true&background=%23ffffff&uppercase=true&format=svg"
                      alt="avatar"
                    />
                    <div className="details">
                      <div className="name">{user.user?.name}</div>
                      <div className="mail">{user.user?.email}</div>
                    </div>
                  </div>
                  <div className="middle">
                    <div className="id item">
                      <h3>User id :</h3>
                      <p>{user.user?._id}</p>
                    </div>
                    <div className="createdDate item">
                      <h3>Account created date :</h3>
                      <p>{user.user?.accountCreatedDate}</p>
                    </div>
                    <div className="searchLimit item">
                      <h3>Search limit :</h3>
                      <p>{user.user?.search_limit}</p>
                    </div>
                    <div className="jobPosted item">
                      <h3>Total job posted :</h3>
                      <p>{user.user?.job_posted}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : navigation === "payment" ? (
            <>
              {!paymentData.success && (
                <div
                  className="loader"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MainButtonLoader />
                </div>
              )}
              {paymentData.success && (
                <>
                  {!paymentData || paymentData.data?.length <= 0 ? (
                    <div className="body-sec noPay">
                      <div className="ico">
                        <BsIcons.BsClockHistory />
                      </div>
                      <div className="par">
                        No payment has been made so far.
                      </div>
                    </div>
                  ) : (
                    <div className="body-sec">
                      {paymentData.data?.map((e) => {
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
                                {e.serviceType} (<span>+{e.search_limit}</span>)
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
              )}
            </>
          ) : navigation === "postings" ? (
            <div className="body-sec">
              {!postdata.success && (
                <div
                  className="loader"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MainButtonLoader />
                </div>
              )}
              {postdata.success && postdata.data?.length <= 0 && (
                <div className="noJobPostings">
                  <img src="/noJob.png" alt="no job placeholder" />
                  <div className="text">You haven't posted any jobs yet</div>
                </div>
              )}
              {postdata.success && postdata.data?.length >= 1 && (
                <div className="postContainer">
                  {postdata.data?.map((e) => {
                    return (
                      <div key={e._id} className="card">
                        <div className="first">
                          <img
                            src={
                              e.logo.filename === "none"
                                ? "/image-placeholder.jpg"
                                : `${HOST}/image/${e.logo.filename}`
                            }
                            alt="better builders"
                          />
                          <div className="details">
                            <div className="title">
                              {e.name}
                              {e.isApproved ? (
                                <span className="approved">Approved</span>
                              ) : (
                                <span className="pending">Pending</span>
                              )}
                            </div>
                            <div className="code">Code : {e.code}</div>
                            <div className="date">
                              Posted on : {e.postedDate}
                            </div>
                            <div className="overview">{e.overview}</div>
                          </div>
                        </div>
                        <div className="second">Delete</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : navigation === "setting" ? (
            <div className="body-sec setting">
              {!user.success && (
                <div
                  className="loader"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MainButtonLoader />
                </div>
              )}
              {user.success && (
                <>
                  <ul>
                    <li>
                      <div className="title">Username</div>
                      <div className="detail">{user.user?.name}</div>
                    </li>
                    <li>
                      {" "}
                      <div className="title">Email</div>
                      <div className="detail">{user.user?.email}</div>
                    </li>
                    <li>
                      <div className="title">Password</div>
                      <div className="detail">*********</div>
                    </li>
                  </ul>
                  <div className="buttons">
                    <button onClick={() => setIsChangePwRunning(true)}>
                      Change password
                    </button>
                    <button onClick={() => setIsPopupCancel(false)}>
                      Delete account
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
}
