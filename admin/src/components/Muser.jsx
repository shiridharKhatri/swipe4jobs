import React, { useEffect, useRef, useState } from "react";
import TopDetails from "./TopDetails";
import { BsIcons, IoIcons, RiIcons } from "../assets/Icons/icons";
import Cookies from "js-cookie";
import axios from "axios";
export default function Muser(props) {
  const HOST = import.meta.env.VITE_HOST;
  const ID = Cookies.get("id");
  const TOKEN = Cookies.get("token");
  let [data, setData] = useState([]);
  let [deletionProcess, setDeletionProcess] = useState({
    running: false,
    id: "",
  });
  const errorPopupRef = useRef(null);
  const deleteUserProcess = (id) => {
    setDeletionProcess({ running: true, id });
  };
  const exit = () => {
    setDeletionProcess({ running: false, id: "" });
  };

  const fetchUser = () => {
    axios
      .get(`${HOST}/user/auth/user/fetch/${ID}`, {
        headers: {
          "auth-token": TOKEN,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setData(response.data.users);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteOnClick = (id) => {
    axios
      .delete(`${HOST}/user/auth/user/remove/admin/${ID}/${id}`, {
        headers: {
          "auth-token": TOKEN,
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          exit();
          fetchUser();
          errorPopupRef.current.style.top = "3rem";
          errorPopupRef.current.innerHTML = `
          <div class="error" style="background:#1aa06d;"}>
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
          <div class="error__title">${response.data.message}</div>
        </div>
          `;
          setTimeout(() => {
            errorPopupRef.current.style.top = "-7rem";
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {deletionProcess.running && (
        <div className="popupCard">
          <div className="card">
            <div className="card-content">
              <p className="card-heading">Confirm Deletion</p>
              <p className="card-description">
                Are you sure you want to permanently remove this user from the
                database? This action is irreversible and will result in the
                deletion of all associated data. Please confirm your decision.
              </p>
            </div>

            <div className="card-button-wrapper">
              <button onClick={exit} className={`card-button secondary`}>
                No
              </button>
              <button
                onClick={() => deleteOnClick(deletionProcess.id)}
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

      <section className=" admin-management  manage-user section">
        <div className="errorPopupsection" ref={errorPopupRef}></div>
        <TopDetails title="Users Management" navbar={props.navContainerRef} />
        <div className="mainContainer">
          <div className="headTitle">
            <div className="name htitile">Name</div>
            <div className="role htitile">Information</div>

            <div className="action htitile">Action</div>
          </div>
          <div className="cards-container">
            {/* Item section start */}
            {data.length <= 0 ? (
              <div className="user-not-found">
                <img src="/userNotFound.png" alt="userNotFound" />
                <p>No registered user found!</p>
              </div>
            ) : (
              <>
                {data?.map((e) => {
                  return (
                    <div key={e._id} className="item">
                      <div className="first">
                        <div className="name">
                          {e.name}
                          {e.isVerified === true ? (
                            <span className="verification">
                              <RiIcons.RiVerifiedBadgeFill />
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="time">
                          <span>
                            <IoIcons.IoMdTime />
                          </span>
                          {e.accountCreatedDate}
                        </div>
                        <p>{e.email}</p>
                      </div>
                      <div className="second">
                        <div
                          className="tags user-tags"
                          style={{
                            background: "transparent",
                            color: "#101010",
                          }}
                        >
                          <div className="limit items">
                            Search limit : <span>{e.search_limit}</span>
                          </div>
                          <div className="posts items">
                            Total posted : {e.job_posted}
                          </div>
                        </div>
                      </div>
                      <div className="third">
                        <div
                          className="delete-admin"
                          onClick={() => deleteUserProcess(e._id)}
                        >
                          <BsIcons.BsPersonFillX />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {/* Item section end */}
          </div>
        </div>
      </section>
    </>
  );
}
