import React, { useState, useEffect } from "react";
import {
  AiIcons,
  Fa6icons,
  Io5Icons,
  IoIcons,
  MdIcons,
} from "../assets/Icons/icons";
import Postform from "./Postform";
import Loader from "./Loader";
import ButtonLoader from "./ButtonLoader";
import TopDetails from "./TopDetails";

const URL = import.meta.env.VITE_HOST;

const STATUSES = {
  ALL: "all",
  PENDING: "pending",
  APPROVED: "approved",
};

const ACTIONS = {
  REJECT: "reject",
  ACCEPT: "accept",
  DELETE: "delete",
};

export default function MPost({
  navContainerRef,
  fetchJobs,
  handelPostAction,
  handelJobPosting,
}) {
  const [selected, setSelected] = useState({ status: "", id: "" });
  const [status, setStatus] = useState(STATUSES.ALL);
  const [jobs, setJobs] = useState([]);
  const [editMode, setEditMode] = useState({
    add: false,
    edit: false,
    data: null,
  });
  const [loadingStatus, setLoadingStatus] = useState({
    success: false,
    status: 500,
  });
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    setLoadingStatus((prev) => ({ ...prev, success: false }));
    fetchJobs()
      .then((res) => {
        setJobs(res.jobs || []);
        setLoadingStatus({ success: true, status: 200 });
      })
      .catch((error) => {
        setLoadingStatus({
          success: true,
          status: error.status === 404 ? 404 : error.status === 500 ? 500 : 403,
        });
      });
  }, [fetchJobs]);

  const handleAction = async (id, action) => {
    setIsButtonLoading(true);
    try {
      handelPostAction(id, action).then((res) => {
        if (res.success === true) {
          handleClose();
          setIsButtonLoading(false);
          window.location.reload();
        }
      });
    } catch (error) {
      setIsButtonLoading(false);
      console.error(error);
    }
  };

  const handleClose = () => {
    setSelected({ status: "", id: "" });
    setEditMode({ add: false, edit: false, data: null });
  };

  const renderConfirmationPopup = () => {
    const popupConfig = {
      [ACTIONS.REJECT]: {
        title: "Rejection Confirmation",
        description:
          "Are you sure you want to reject this job posting? This action cannot be undone.",
      },
      [ACTIONS.ACCEPT]: {
        title: "Acceptance Confirmation",
        description:
          "Are you sure you want to accept this job posting? This action will finalize the acceptance process.",
        secondaryClass: "accept-secondary",
        primaryClass: "accept-primary",
      },
      [ACTIONS.DELETE]: {
        title: "Deletion Confirmation",
        description:
          "Are you sure you want to delete this job posting? This action cannot be undone.",
      },
    };

    const config = popupConfig[selected.status];
    if (!config) return null;

    return (
      <div className="popupCard">
        <div className="card">
          <div className="card-content">
            <p className="card-heading">{config.title}</p>
            <p className="card-description">{config.description}</p>
          </div>
          <div className="card-button-wrapper">
            <button
              onClick={handleClose}
              className={`card-button secondary ${config.secondaryClass || ""}`}
            >
              No
            </button>
            <button
              onClick={() => handleAction(selected.id, selected.status)}
              className={`card-button primary ${config.primaryClass || ""}`}
            >
              {isButtonLoading ? <ButtonLoader /> : "Yes"}
            </button>
          </div>
          <button onClick={handleClose} className="exit-button">
            <svg height="20px" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderJobCard = (job) => (
    <div key={job._id} className="postCard">
      <img
        src={
          !job.logo?.filename ||
          job.logo?.filename === "undefined " ||
          job.logo.filename === "none"
            ? `/no-image.svg`
            : `${URL}/image/${job.logo?.filename}`
        }
        alt={job.name}
      />
      <div className="detail-side">
        <div className="title">
          {job.name}{" "}
          <span className={job.isApproved ? "approved" : "pending"}>
            {job.isApproved ? "Approved" : "Pending"}
          </span>
        </div>
        <div className="position">
          <span className="state">{job.state}</span>
          <span className="position">{job.position.join(" | ")}</span>
          <span className="schedule">{job.schedule.join(" | ")}</span>
        </div>
        <div className="tags">
          <span>{job.city}</span>
          <span className="dot"></span>
          <span>{job.state}</span>
          <span className="dot"></span>
          <span>{job.zip}</span>
        </div>
        <div className="overview">{job.overview}</div>
      </div>
      <div className="side-action">
        <div className="time menu">
          <span>
            <IoIcons.IoMdTime />
          </span>
          <div className="dateDisplay">{job.postedDate}</div>
        </div>
        {job.isApproved ? (
          <>
            <div
              onClick={() => setEditMode({ edit: true, data: job })}
              style={{ background: "#101010" }}
              className="edit menu"
            >
              <span>
                <AiIcons.AiOutlineEdit />
              </span>
            </div>
            <div
              onClick={() =>
                setSelected({ status: ACTIONS.DELETE, id: job._id })
              }
              className="delete menu"
            >
              <span>
                <MdIcons.MdDelete />
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() =>
                setSelected({ status: ACTIONS.ACCEPT, id: job._id })
              }
              className="accept menu"
            >
              <span>
                <Fa6icons.FaCheck />
              </span>
            </div>
            <div
              onClick={() =>
                setSelected({ status: ACTIONS.REJECT, id: job._id })
              }
              className="reject menu"
            >
              <span>
                <Io5Icons.IoCloseSharp />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const filteredJobs = jobs.filter((job) => {
    if (status === STATUSES.ALL) return true;
    if (status === STATUSES.PENDING) return !job.isApproved;
    if (status === STATUSES.APPROVED) return job.isApproved;
    return false;
  });

  return (
    <>
      {renderConfirmationPopup()}
      <section className="post-management section">
        <TopDetails title="Post Management" navbar={navContainerRef} />
        <div className="manage-section">
          <div className="container">
            <div className="tabs">
              <div className="secondTab" style={{ display: "flex" }}>
                {Object.entries({
                  [STATUSES.ALL]: "All",
                  [STATUSES.PENDING]: "Pending",
                  [STATUSES.APPROVED]: "Approved",
                }).map(([key, label]) => (
                  <React.Fragment key={key}>
                    <input
                      type="radio"
                      id={`radio-${key}`}
                      name="tabs"
                      defaultChecked={key === STATUSES.ALL}
                    />
                    <label
                      onClick={() => setStatus(key)}
                      className="tab"
                      htmlFor={`radio-${key}`}
                    >
                      {label}
                      {key !== STATUSES.APPROVED && (
                        <div className="notification">
                          {key === STATUSES.ALL
                            ? jobs.length
                            : jobs.filter((job) => !job.isApproved).length}
                        </div>
                      )}
                    </label>
                  </React.Fragment>
                ))}
              </div>
              <div
                onClick={() => setEditMode({ add: true })}
                className="button"
              >
                <span className="post-job">
                  <IoIcons.IoMdAddCircle />
                </span>
              </div>
            </div>
            <div className="posts">
              {!loadingStatus.success && <Loader position="absolute" />}
              {loadingStatus.success && filteredJobs.length === 0 && (
                <div className="noResult">
                  There are no {status === STATUSES.ALL ? "" : status} posts
                  {status === STATUSES.PENDING
                    ? " pending"
                    : status === STATUSES.APPROVED
                    ? " approved"
                    : ""}
                  &nbsp;at the moment.
                </div>
              )}
              {loadingStatus.success && filteredJobs.map(renderJobCard)}
            </div>
          </div>
        </div>
      </section>
      {editMode.add && (
        <Postform
          handelJobPosting={handelJobPosting}
          close={handleClose}
          title="Post Jobs"
          type="post"
        />
      )}
      {editMode.edit && (
        <Postform
          handelJobPosting={handelJobPosting}
          close={handleClose}
          title="Edit Post"
          data={editMode.data}
          type="edit"
        />
      )}
    </>
  );
}
