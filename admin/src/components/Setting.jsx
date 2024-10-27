import React, { useEffect, useRef, useState } from "react";
import { Fa6icons, MdIcons, RiIcons } from "../assets/Icons/icons";
import axios from "axios";
import Cookies from "js-cookie";
import TopDetails from "./TopDetails";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
export default function Setting(props) {
  const HOST = import.meta.env.VITE_HOST;
  const TOKEN = Cookies.get("admin-token");
  const ID = Cookies.get("admin-id");
  const saveChangesRef = useRef(null);
  const [adminData, setAdminData] = useState({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isDeleteOptionOpen, setDeleteOptionOpen] = useState(false);
  const [date, setDate] = useState({
    start: "2024-10-01",
    end: "2024-12-01",
  });
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigate();
  const handleClose = () => {
    setDeleteOptionOpen(false);
  };
  const dateValueOnChange = (e) => {
    const { name, value } = e.target;
    setDate({ ...date, [name]: value });
    saveChangesRef.current.style.transform = "scale(1)";
  };

  const openDeleteOption = () => {
    setDeleteOptionOpen(true);
  };
  const deleteAccount = () => {
    axios
      .delete(`${HOST}/auth/admin/existing/delete/${ID}`, {
        headers: {
          "auth-token": TOKEN,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          Cookies.remove("admin-token");
          Cookies.remove("admin-id");
          navigation("/");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeDate = () => {
    axios
      .put(
        `${HOST}/api/postRules/post/rules/update/67133b8ac9b1f8fe80b3ee7c`,
        {
          start: date.start,
          end: date.end,
        },
        {
          headers: {
            "auth-token": TOKEN,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsLoading(true)
    const fetchAdmin = () => {
      axios
        .get(`${HOST}/auth/admin/existing/fetch`, {
          headers: {
            "auth-token": TOKEN,
          },
        })
        .then((res) => {
          setIsLoading(false)
          setAdminData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchAdmin();
  }, []);
  return (
    <>
      {isDeleteOptionOpen && (
        <div className="popupCard">
          <div className="card">
            <div className="card-content">
              <p className="card-heading">Deletion Confirmation</p>
              <p className="card-description">
                This action is irreversible and will permanently remove all
                associated data, including settings and permissions. You will
                lose access to administrative features.
              </p>
            </div>
            <div className="card-button-wrapper">
              <button onClick={handleClose} className={`card-button secondary`}>
                CANCEL
              </button>
              <button onClick={deleteAccount} className={`card-button primary`}>
                {isButtonLoading ? <ButtonLoader /> : "DELETE"}
              </button>
            </div>
            <button onClick={handleClose} className="exit-button">
              <svg height="20px" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      <section className="section setting">
        <TopDetails title="Setting" navbar={props.navContainerRef} />
        {isLoading && <Loader/>}
        {!isLoading && <div className="setting-card">
          <div className="details">
            <div className="item name">
              <div className="label">Name</div>
              <div className="value">
                {adminData.admin?.name}
                <span>
                  <MdIcons.MdOutlineEdit />
                </span>
              </div>
            </div>
            <div className="item email">
              <div className="label">Email</div>
              <div className="value">
                {adminData.admin?.email}
                <span>
                  <MdIcons.MdOutlineEdit />
                </span>
              </div>
            </div>
            <div className="item password">
              <div className="label">Password</div>
              <div className="value">
                xxxxxxxxx{" "}
                <span>
                  <MdIcons.MdOutlineEdit />
                </span>
              </div>
            </div>
            <div className="item free-trial">
              <div className="label">Free trial months</div>
              <div className="box">
                <div>
                  From :{" "}
                  <input
                    onChange={dateValueOnChange}
                    type="date"
                    value={date.start}
                    name="start"
                    id="dateFrom"
                  />
                  To :{" "}
                  <input
                    onChange={dateValueOnChange}
                    type="date"
                    value={date.end}
                    name="end"
                    id="dateTo"
                  />
                </div>
                <div
                  onClick={changeDate}
                  ref={saveChangesRef}
                  className="saveChange"
                >
                  <Fa6icons.FaCheck />
                </div>
              </div>
            </div>
            <div className="item role">
              <div className="label">Role</div>
              <div className="value">{adminData.admin?.role}</div>
            </div>
            <div className="item verified">
              <div className="label">Account status</div>
              <div className="value">
                {adminData.admin?.isVerified === true ? (
                  <>
                    {" "}
                    Verified &nbsp;
                    <RiIcons.RiVerifiedBadgeFill />
                  </>
                ) : (
                  "Not verified"
                )}
              </div>
            </div>

            <div className="item id">
              <div className="label">Admin id</div>
              <div className="value">{adminData.admin?._id}</div>
            </div>
            <div className="item createdDate">
              <div className="label">Account created date</div>
              <div className="value">{adminData.admin?.createdDate}</div>
            </div>
            <div className="item delete">
              <button onClick={() => openDeleteOption()}>Delete account</button>
            </div>
          </div>
        </div>}
      </section>
    </>
  );
}
