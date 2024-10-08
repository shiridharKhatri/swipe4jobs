import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BsIcons, Io5Icons } from "../assets/Icons/icons";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";
import TopDetails from "./TopDetails";
export default function Madmin(props) {
  const navigate = useNavigate();
  const HOST = import.meta.env.VITE_HOST;
  const [adminData, setAdminData] = useState([]);
  const [removeAdmin, setRemoveAdmin] = useState({ id: "", isOpen: false });
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const errorPopupRef = useRef(null);
  const roles = ["Admin", "Modiator", "Editor"];
  const roleOnChange = (id, role) => {
    axios
      .post(
        `${HOST}/auth/admin/existing/access/change-role/${id}/${role.toLowerCase()}`,
        null,
        {
          headers: {
            "auth-token": Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response.data.success === false) {
          errorPopupRef.current.style.top = "3rem";
          errorPopupRef.current.innerHTML = `
          <div class="error">
          <div class="error__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              viewBox="0 0 24 24"
              height="24"
              fill="none"
            >
              <path
                fill="#393a37"
                d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
              ></path>
            </svg>
          </div>
          <div class="error__title">${error.response.data.message}</div>

        </div>
          `;
        }
        setTimeout(() => {
          errorPopupRef.current.style.top = "-7rem";
        }, 3000);
      });
  };
  const exit = () => {
    setRemoveAdmin({ id: "", isOpen: false });
  };
  const deleteAdminProcess = (id) => {
    setRemoveAdmin({ id, isOpen: true });
  };
  const deleteOnClick = (id) => {
    axios
      .delete(`${HOST}/auth/admin/existing/delete/${id}`, {
        headers: {
          "auth-token": Cookies.get("token"),
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          exit();
          errorPopupRef.current.style.top = "3rem";
          errorPopupRef.current.innerHTML = `
          <div class="error">
          <div class="error__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              viewBox="0 0 24 24"
              height="24"
              fill="none"
            >
              <path
                fill="#393a37"
                d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
              ></path>
            </svg>
          </div>
          <div class="error__title">${error.response.data.message}</div>

        </div>
          `;
        }
        setTimeout(() => {
          errorPopupRef.current.style.top = "-7rem";
        }, 3000);
      });
  };
  const signupOpenOnClick = (isOpen) => {
    setIsSignupOpen(isOpen);
  };
  useEffect(() => {
    const fetchAllAdmin = () => {
      axios
        .post(`${HOST}/auth/admin/existing/access/fetch-all`, null, {
          headers: {
            "auth-token": Cookies.get("token"),
          },
        })
        .then((res) => {
          setAdminData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchAllAdmin();
  }, []);
  return (
    <>
      {isSignupOpen && (
        <Signup
          errorPopupRef={errorPopupRef}
          signupAction={signupOpenOnClick}
        />
      )}
      {removeAdmin.isOpen && (
        <div className="popupCard">
          <div className="card">
            <div className="card-content">
              <p className="card-heading">Confirm Deletion</p>
              <p className="card-description">
                Are you sure you want to permanently remove this admin from the
                database? This action is irreversible and will result in the
                deletion of all associated data. Please confirm your decision.
              </p>
            </div>

            <div className="card-button-wrapper">
              <button onClick={exit} className={`card-button secondary`}>
                No
              </button>
              <button
                onClick={() => deleteOnClick(removeAdmin.id)}
                className={`card-button primary`}
              >
                Yes
              </button>
            </div>
            <button onClick={exit} className="exit-button">
              <svg height="20px" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      <section className="admin-management section">
        <div className="errorPopupsection" ref={errorPopupRef}></div>
        <TopDetails title="Manage admin" navbar={props.navContainerRef} />
        <div className="mainContainer">
          <div className="headTitle">
            <div className="name htitile">Name</div>
            <div className="role htitile">
              Admin role{" "}
              <span className="help">
                <Io5Icons.IoHelp />
                <div className="tooltip">
                  <div className="admin tips-card">
                    <span className="mainPoint">ADMIN </span>
                    <span className="text">
                      Admin has full access to the dashboard, can manage all
                      posts, manage admins, view all analytics, and change site
                      settings.
                    </span>
                  </div>
                  <div className="modiator tips-card">
                    <span className="mainPoint">MODIATOR</span>
                    <span className="text">
                      Moderator can view the dashboard, approve or edit posts,
                      view analytics, but has no access to admin management or
                      settings.
                    </span>
                  </div>
                  <div className="editor tips-card">
                    <span className="mainPoint">EDITOR</span>
                    <span className="text">
                      Editor can view posts on the dashboard, create or edit
                      posts, but has no access to admin management, analytics,
                      or settings.
                    </span>
                  </div>
                </div>
              </span>
            </div>

            <div className="action htitile">Action</div>
          </div>
          <div className="cards-container">
            {/* Item section start */}
            {adminData.adminData?.map((el) => {
              return (
                <div key={el._id} className="item">
                  <div className="first">
                    <div className="name">{el.name}</div>
                    <p>{el.email}</p>
                  </div>
                  <div className="second">
                    <div
                      className="tags"
                      style={
                        el.role.toLowerCase() === "admin"
                          ? { background: "#003366", fontWeight: "bold" }
                          : el.role.toLowerCase() === "modiator"
                          ? { background: "#FFA500", fontWeight: "bold" }
                          : { background: "#4CAF50", fontWeight: "bold" }
                      }
                    >
                      {el.role}
                    </div>
                  </div>
                  <div className="third">
                    <div className="select">
                      <div className="selected" data-default="All">
                        <span>Change role</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                          className="arrow"
                        >
                          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                        </svg>
                      </div>
                      <div className="options">
                        {roles.map((e, index) => {
                          return (
                            <div key={index} title="option-1">
                              <input id="option-1" name="option" type="radio" />
                              <label
                                onClick={() => roleOnChange(el._id, e)}
                                className="option"
                              >
                                {e}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {el._id === props.id ? (
                      <div
                        className="setting"
                        onClick={() =>
                          navigate(`/home/authorized/${props.id}/setting`)
                        }
                      >
                        <Io5Icons.IoSettingsSharp />
                      </div>
                    ) : (
                      <div
                        className="delete-admin"
                        onClick={() => deleteAdminProcess(el._id)}
                      >
                        <BsIcons.BsPersonFillX />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Item section end */}
            <div
              onClick={() => signupOpenOnClick(true)}
              className="item register-admin"
            >
              <div>
                <span>
                  <Io5Icons.IoPersonAdd />
                </span>{" "}
                Register new admin
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
