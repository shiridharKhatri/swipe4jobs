import React, { useEffect, useRef, useState } from "react";
import { FaIcons, Io5Icons, MdIcons, RxIcons } from "../assets/Icons/icons";
import { formValidation, normalBorder } from "../data/validation";
import "../styles/component/Post.css";
import "../styles/responsive/App.css";
import ButtonLoader from "../tools/ButtonLoader";
import Header from "../components/Header";
import { states, category } from "../data/jsonData";
import axios from "axios";
import Cookies from "js-cookies";
export default function Post() {
  const HOST = import.meta.env.VITE_HOST;
  const ID = Cookies.getItem("id");
  const TOKEN = Cookies.getItem("token");

  // useStates
  const [isOptionActive, setIsOptionActive] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [inputs, setInputs] = useState({
    entityName: "",
    securityCode: "",
    state: "",
    city: "",
    zip: "",
    overview: "",
  });
  const [suggestionValue, setSuggestionVal] = useState([]);
  const [imageValue, setImageValue] = useState();
  const [scheduleValue, setScheduleValue] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [positionVal, setPositionVal] = useState("");

  // useRefs
  const imagePreviewRef = useRef(null);
  const popupMessage = useRef(null);
  const placeholderDrop = useRef(null);
  const errorMessageRef = useRef(null);

  const getTypeValue = (e) => {
    let available = false;
    let newCheckedValue = [...scheduleValue];
    newCheckedValue.forEach((el, index) => {
      if (el === e.target.name) {
        available = true;
        newCheckedValue.splice(index, 1);
      }
    });
    if (newCheckedValue.length > 2) {
      newCheckedValue.shift();
    }
    if (!available) {
      newCheckedValue.push(e.target.name);
    }
    setScheduleValue(newCheckedValue);
  };

  const inputChangeState = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    if (name === "zip") {
      if (isNaN(Number(inputs.zip))) {
        setInputs((prev) => ({ ...prev, zip: "" }));
      } else {
        setInputs({ ...inputs, [name]: value });
      }
    }
    if (name === "securityCode") {
      if (isNaN(Number(inputs.securityCode))) {
        setInputs((prev) => ({ ...prev, securityCode: "" }));
      } else {
        setInputs({ ...inputs, [name]: value });
      }
    }
    if (name === "overview") {
      setCharacterCount(value.length);
    }
    if (name === "state") {
      if (value === "" || value.length <= 0) {
        setSuggestionVal([]);
      }
    }
  };

  const clearAllFields = (e) => {
    setInputs({
      entityName: "",
      securityCode: "",
      state: "",
      city: "",
      zip: "",
      overview: "",
    });
    normalBorder();
    removeImage();
    setCharacterCount(0);
  };
  const submitPostOnClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    formValidation(inputs, scheduleValue);
    if (formValidation(inputs, scheduleValue)) {
      let formdata = new FormData();
      formdata.append("name", inputs.entityName);
      scheduleValue.forEach((schedule) => {
        formdata.append("schedule[]", schedule);
      });
      formdata.append("state", inputs.state);
      formdata.append("code", inputs.securityCode);
      formdata.append("city", inputs.city);
      formdata.append("zip", inputs.zip);
      formdata.append("overview", inputs.overview);
      formdata.append("position", positionVal);
      formdata.append("logo", imageValue);

      let bodyContent = formdata;
      let reqOptions = {
        url: `${HOST}/api/jobs/post-job/user/${ID}`,
        method: "POST",
        headers: { Accept: "*/*", "auth-token": TOKEN },
        data: bodyContent,
      };
      try {
        let response = await axios.request(reqOptions);
        if (response.status === 200) {
          if (response.data.success === true) {
            clearAllFields();
            setLoading(false);
            setStatus("success");
          } else {
            setLoading(false);
            setStatus("failure");
          }

          popupMessage.current.style.top = "3rem";
        } else {
          setLoading(false);
          popupMessage.current.style.top = "-15rem";
        }
      } catch (error) {
        if (error.response.status === 401) {
          errorMessageRef.current.innerText = `Please log in to your account to post jobs. Thank you!`;
          setLoading(false);
          setStatus("failure");
          popupMessage.current.style.top = "3rem";
        }else if(error.response.status === 409){
          errorMessageRef.current.innerText = `A similar job has already been posted from this account.`;
          setLoading(false);
          setStatus("failure");
          popupMessage.current.style.top = "3rem";
        }
      }
      setTimeout(() => {
        popupMessage.current.style.top = "-15rem";
      }, [5000]);
    } else {
      setLoading(false);
    }
  };
  const optionsOnClick = () => {
    const typeOptions = document.getElementById("typeOptions");
    if (isOptionActive) {
      setIsOptionActive(false);
      typeOptions.style.transform = "scale(0)";
    } else {
      setIsOptionActive(true);
      typeOptions.style.transform = "scale(1)";
    }
  };

  const grabImage = (e) => {
    const imagePreviewSection = document.getElementById("imagePrevSection");
    imagePreviewSection.style.display = "flex";
    const validImage = e.target.files[0];
    if (validImage) {
      setImageValue(validImage);
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewRef.current.src = e.target.result;
      };
      reader.readAsDataURL(validImage);
    }
  };

  const removeImage = () => {
    const imagePreviewSection = document.getElementById("imagePrevSection");
    imagePreviewSection.style.display = "none";
    setImageValue();
  };

  const typeMouseEnter = () => {
    setIsOptionActive(true);
    const typeOptions = document.getElementById("typeOptions");
    typeOptions.style.transform = "scale(1)";
  };

  const typeMouseLeave = () => {
    setIsOptionActive(false);
    const typeOptions = document.getElementById("typeOptions");
    typeOptions.style.transform = "scale(0)";
  };

  useEffect(() => {
    window.document.title = "SWIPE 4 JOBS | Post";
  }, []);

  useEffect(() => {
    ["dragover", "drop"].forEach((eventName) => {
      document.body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }, []);
  const showSuggestions = () => {
    const stateInpValue = inputs.state.trim().toLowerCase();

    if (stateInpValue.length > 0) {
      const suggestions = states.filter((state) =>
        state.toLowerCase().startsWith(stateInpValue)
      );
      setSuggestionVal(suggestions);
    } else {
      setSuggestionVal([]);
    }
  };
  const suggestionKeyDown = (e) => {
    if (e.key.toLowerCase() === "tab" || e.key.toLowerCase() === "enter") {
      setInputs((prev) => ({ ...prev, state: suggestionValue[0] }));
      setSuggestionVal([]);
    }
  };
  const dragOverEvent = (e) => {
    e.preventDefault();
    placeholderDrop.current.style.transform = "scale(1)";
  };
  const dragLeaveEvent = (e) => {
    e.preventDefault();
    placeholderDrop.current.style.transform = "scale(0)";
  };
  const dropEvent = (e) => {
    e.preventDefault();
    const imagePreviewSection = document.getElementById("imagePrevSection");
    imagePreviewSection.style.display = "flex";
    const validImage = e.dataTransfer.files[0];
    if (validImage) {
      setImageValue(validImage);
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewRef.current.src = e.target.result;
      };
      reader.readAsDataURL(validImage);
    }
    placeholderDrop.current.style.transform = "scale(0)";
  };
  const selectStateOnClick = (state) => {
    setInputs((prev) => ({ ...prev, state: state }));
    setSuggestionVal([]);
  };

  const positionValue = (position) => {
    setPositionVal(position);
  };
  return (
    <>
      <div className="popup-container">
        <div
          className="messageCard success-failure-container"
          ref={popupMessage}
        >
          {status === "success" ? (
            <div className="success">
              <div className="icon">
                <FaIcons.FaCheckCircle />
              </div>
              <div className="message">
                Success ! Post successfully sent for review.
              </div>
            </div>
          ) : (
            <div className="failure">
              <div className="icon">
                <MdIcons.MdError />
              </div>
              <div className="message" ref={errorMessageRef}>
                Failed! Something went wrong try again later.
              </div>
            </div>
          )}
        </div>
      </div>
      <Header
        firstText="SWIPE"
        secondHeighlightText="4"
        lastText="JOBS"
        byline=" Showcasing the Future of the Career Marketplace"
      />
      <div className="postHeaderText">POST</div>
      <section className="jobPosting">
        <div className="formSection">
          <form action="">
            <div className="btns">
              <button
                type="button"
                aria-label="remove all inputs value"
                onClick={clearAllFields}
              >
                CLEAR ALL
              </button>
              {!isLoading && (
                <button
                  type="submit"
                  aria-label="post submit for review"
                  onClick={submitPostOnClick}
                  className="submitForm"
                >
                  {status === "success" ? "RECEIVED" : "SUBMIT"}
                </button>
              )}
              {isLoading && (
                <button
                  type="submit"
                  aria-label="post submit for review"
                  onClick={submitPostOnClick}
                  className="submitForm"
                >
                  <ButtonLoader />
                </button>
              )}
            </div>
            <div className="all-inputs">
              <div className="labels entityName">
                <label htmlFor="entityName">
                  <span>
                    <span className="requiredField">*</span> Entity Name
                  </span>
                </label>
                <input
                  maxLength={40}
                  onChange={inputChangeState}
                  value={inputs.entityName}
                  type="text"
                  name="entityName"
                  id="entityName"
                />
                <p id="invalidName"></p>
              </div>
              <div style={{ display: "flex" }} className="combineSection">
                <div className="labels positions" id="schedule">
                  <label htmlFor="positions">
                    <span>
                      <span className="requiredField">*</span> Schedule
                    </span>
                  </label>

                  <div className="selection">
                    <div
                      onClick={optionsOnClick}
                      className="selectionPlaceholder"
                      id="selectionPlaceholder"
                    >
                      {scheduleValue.length === 0 ? (
                        <span></span>
                      ) : (
                        <div className="type-tags">
                          {scheduleValue.map((e, index) => {
                            return <span key={index}>{e}</span>;
                          })}
                        </div>
                      )}
                      {isOptionActive ? (
                        <span style={{ display: "flex" }}>
                          <Io5Icons.IoChevronUpOutline />
                        </span>
                      ) : (
                        <span style={{ display: "flex" }}>
                          <Io5Icons.IoChevronDownOutline />
                        </span>
                      )}
                    </div>
                    <p id="invalidChoice"></p>

                    <div
                      onMouseEnter={typeMouseEnter}
                      onMouseLeave={typeMouseLeave}
                      id="typeOptions"
                      className="options"
                    >
                      <div className="checkOptions">
                        <div className="checkBox fullTime">
                          <div className="titleBox">Select a Maximum of 3</div>
                          <label htmlFor="fullTime">
                            <span
                              style={
                                scheduleValue.includes("Full Time")
                                  ? { background: "#101010" }
                                  : { background: "transparent" }
                              }
                            ></span>
                            Full Time
                          </label>
                          <input
                            onChange={getTypeValue}
                            type="checkbox"
                            name="Full Time"
                            id="fullTime"
                          />
                        </div>
                        <div className="checkBox partTime">
                          <label htmlFor="partTime">
                            <span
                              style={
                                scheduleValue.includes("Part Time")
                                  ? { background: "#101010" }
                                  : { background: "transparent" }
                              }
                            ></span>
                            Part Time
                          </label>
                          <input
                            onChange={getTypeValue}
                            type="checkbox"
                            name="Part Time"
                            id="partTime"
                          />
                        </div>
                        <div className="checkBox inHouse">
                          <label htmlFor="inHouse">
                            <span
                              style={
                                scheduleValue.includes("In-House")
                                  ? { background: "#101010" }
                                  : { background: "transparent" }
                              }
                            ></span>
                            In-House
                          </label>
                          <input
                            onChange={getTypeValue}
                            type="checkbox"
                            name="In-House"
                            id="inHouse"
                          />
                        </div>
                        <div className="checkBox remote">
                          <label htmlFor="remote">
                            <span
                              style={
                                scheduleValue.includes("Remote")
                                  ? { background: "#101010" }
                                  : { background: "transparent" }
                              }
                            ></span>
                            Remote
                          </label>
                          <input
                            onChange={getTypeValue}
                            type="checkbox"
                            name="Remote"
                            id="remote"
                          />
                        </div>
                        <div className="checkBox contract">
                          <label htmlFor="contract">
                            <span
                              style={
                                scheduleValue.includes("Contract")
                                  ? { background: "#101010" }
                                  : { background: "transparent" }
                              }
                            ></span>
                            Contract
                          </label>
                          <input
                            onChange={getTypeValue}
                            type="checkbox"
                            name="Contract"
                            id="contract"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p id="invalidpositions"></p>
                </div>

                <div className="labels ">
                  <label htmlFor="positions">
                    <span>
                      <span className="requiredField">*</span> Position
                    </span>
                  </label>
                  <div
                    className="selectionPlaceholder selectionPlaceholderPosition"
                    id="selectionPlaceholderPosition"
                  >
                    <span>{positionVal}</span>
                    <span style={{ display: "flex" }}>
                      <Io5Icons.IoChevronDownOutline />
                    </span>

                    <div className="absoluteSelectionOptions">
                      {category.map((e, index) => {
                        return (
                          <div
                            style={
                              positionVal.toLowerCase() === e.toLowerCase()
                                ? { background: "#44445545" }
                                : { background: "transparent" }
                            }
                            onClick={() => positionValue(e)}
                            key={index}
                            className="item"
                          >
                            {e}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="labels state">
                <label htmlFor="state">
                  <span>
                    <span className="requiredField">*</span> State
                  </span>
                </label>
                <input
                  onInput={showSuggestions}
                  onChange={inputChangeState}
                  value={inputs.state}
                  onKeyDown={suggestionKeyDown}
                  type="text"
                  name="state"
                  id="state"
                  autoComplete="off"
                />{" "}
                <p id="invalidState"></p>
                {suggestionValue.length <= 0 ? (
                  ""
                ) : (
                  <div className="stateSuggestion">
                    <ul style={{ listStyle: "none" }}>
                      {suggestionValue.map((el, ind) => {
                        return (
                          <li onClick={() => selectStateOnClick(el)} key={ind}>
                            {el}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div className="labels securityCode">
                <label htmlFor="securityCode">
                  <span>
                    <span className="requiredField">*</span> Your Preferred 3
                    Number Security Code{" "}
                  </span>
                </label>
                <input
                  style={{ textTransform: "uppercase" }}
                  onChange={inputChangeState}
                  value={inputs.securityCode}
                  type="text"
                  name="securityCode"
                  id="securityCode"
                  maxLength={3}
                  max={3}
                />{" "}
                <p id="invalidCode"></p>
              </div>
              <div className="labels city">
                <label htmlFor="city">
                  <span>
                    <span className="requiredField">*</span> City
                  </span>
                </label>
                <input
                  onChange={inputChangeState}
                  value={inputs.city}
                  type="text"
                  name="city"
                  id="city"
                />{" "}
                <p id="invalidCity"></p>
              </div>
              <div className="labels zipCode">
                <label htmlFor="zip">
                  <span>
                    <span className="requiredField">*</span> Zip Code
                  </span>
                </label>
                <div className="double">
                  <div className="inp">
                    <input
                      onChange={inputChangeState}
                      value={inputs.zip}
                      type="text"
                      name="zip"
                      id="zip"
                      max={5}
                      maxLength={5}
                    />{" "}
                    <p id="invalidZip"></p>
                  </div>
                </div>
              </div>
              <div className="label textArea">
                <label htmlFor="summary">
                  {" "}
                  <span
                    style={{
                      color: "var(--primary-colour)",
                      fontSize: "1.8rem",
                    }}
                    className="requiredField"
                  >
                    *
                  </span>{" "}
                  Overview
                </label>
                <div className="textarea">
                  <textarea
                    maxLength={65}
                    onChange={inputChangeState}
                    value={inputs.overview}
                    name="overview"
                    id="overview"
                    rows={10}
                  ></textarea>
                  <p id="invalidoverview"></p>
                  <div className="notice">
                    <div style={{ display: "flex" }}>
                      Note: Maximum of 65 characters including spaces.
                      <br />
                      Note: Minimize the use of uppercase letters.
                    </div>
                    <div style={{ fontWeight: "bold" }}>
                      {characterCount} / 65
                    </div>
                  </div>
                </div>
              </div>
              <div className="label imageSelection">
                <div className="title">Upload Logo</div>
                <div className="uploadPreviewSection">
                  <div id="imagePrevSection" className="imagePrevSection">
                    <img
                      src=""
                      ref={imagePreviewRef}
                      id=""
                      alt="preview image"
                    />
                    <div onClick={removeImage} className="remove">
                      <RxIcons.RxCross2 />
                    </div>
                  </div>
                  <label
                    onDragOver={dragOverEvent}
                    onDragLeave={dragLeaveEvent}
                    onDrop={dropEvent}
                    htmlFor="file-input-hidden"
                    className="drop-container"
                  >
                    <div ref={placeholderDrop} className="placeHolder">
                      <img src="drop.svg" alt="drop svg placeholder" />
                      <div className="drop-here-text">Drop here</div>
                    </div>
                    <span className="drop-title">Drop logo here</span>
                    <div
                      className="or"
                      style={{ fontSize: "1.3rem", fontWeight: "bold" }}
                    >
                      or
                    </div>
                    <div id="file-input" className="input">
                      {imageValue ? (
                        <>
                          <button aria-label="Choose image">
                            Replace logo
                          </button>{" "}
                          <span>
                            {imageValue.name.length > 40
                              ? imageValue.name.slice(0, 40) + "...."
                              : imageValue.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <button aria-label="Choose image">
                            SELECT LOGO{" "}
                          </button>{" "}
                          <span>No logo selected</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      required=""
                      onChange={grabImage}
                      id="file-input-hidden"
                      hidden
                    />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
