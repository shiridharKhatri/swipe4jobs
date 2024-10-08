import React from "react";
import TopDetails from "./TopDetails";
import { BsIcons, Io5Icons, IoIcons, RiIcons } from "../assets/Icons/icons";

export default function Muser(props) {
  return (
    <section className=" admin-management  manage-user section">
      <TopDetails title="Users Management" navbar={props.navContainerRef} />
      <div className="mainContainer">
        <div className="headTitle">
          <div className="name htitile">Name</div>
          <div className="role htitile">Information</div>

          <div className="action htitile">Action</div>
        </div>
        <div className="cards-container">
          {/* Item section start */}

          <div className="item">
            <div className="first">
              <div className="name">
                Shiridha Khatri{" "}
                <span className="verification">
                  <RiIcons.RiVerifiedBadgeFill />
                </span>
              </div>
              <div className="time">
                <span>
                  <IoIcons.IoMdTime />
                </span>
                October 5th 2024, 10:50:57 am
              </div>
              <p>jsdev976@gmail.com</p>
            </div>
            <div className="second">
              <div
                className="tags user-tags"
                style={{ background: "transparent", color: "#101010" }}
              >
                <div className="limit items">
                  Search limit : <span>34</span>
                </div>
                <div className="posts items">Total posted : 34</div>
              </div>
            </div>
            <div className="third">
              <div
                className="delete-admin"
                // onClick={() => deleteAdminProcess(el._id)}
              >
                <BsIcons.BsPersonFillX />
              </div>
            </div>
          </div>
          {/* Item section end */}
        </div>
      </div>
    </section>
  );
}
