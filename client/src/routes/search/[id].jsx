import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CiIcons,
  FaIcons,
  GiIcons,
  Io5Icons,
  RiIcons,
} from "../../assets/Icons/icons";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookies";
import "../../styles/component/Search.css";
import { states, category } from "../../data/jsonData";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
export default function SearchJobs() {
  const { fetchUser } = useContext(Context);
  const HOST = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState([]);
  let [selectedLimitQty, setSelectedLimitQty] = useState(1);
  const stateRef = useRef(null);
  const positionRef = useRef(null);
  const alertPopup = useRef(null);
  const paymentCardRef = useRef(null);
  const [user, setUser] = useState({});
  const [isPaymentProceeded, setIsPaymentProceeded] = useState(false);
  const [searchLimit, setSearchLimit] = useState(3);
  const [data, setData] = useState({
    success: false,
    data: [],
    error: false,
    loading: true,
  });
  const [active, setActive] = useState({
    stateDropDown: false,
    categoryDropDown: false,
  });
  const [textFieldInput, setTextFieldInput] = useState({
    state: "Select State",
    category: "Select 1, 2, or 3 Positions",
    searchValue: "",
  });

  const searchFieldChangeState = (e) => {
    setTextFieldInput((prev) => ({ ...prev, searchValue: e.target.value }));
  };

  const stateValue = (state) => {
    setData((prev) => ({ ...prev, loading: true }));
    setTextFieldInput((prev) => ({ ...prev, state }));
  };

  const categoryValue = (category) => {
    setData((prev) => ({ ...prev, loading: true }));
    setSelectedPosition((prevSelectedPosition) => {
      const isPositionAvailable = prevSelectedPosition.some(
        (elem) => elem.toLowerCase() === category.toLowerCase()
      );

      if (isPositionAvailable) {
        return prevSelectedPosition.filter(
          (elem) => elem.toLowerCase() !== category.toLowerCase()
        );
      } else {
        const newSelectedPositions = [...prevSelectedPosition, category];

        if (newSelectedPositions.length > searchLimit) {
          alertPopup.current.style.transform = "scale(1)";
          return prevSelectedPosition;
        }

        return newSelectedPositions;
      }
    });
  };
  const cancelButton = () => {
    alertPopup.current.style.transform = "scale(0)";
    setIsPaymentProceeded(false);
  };
  const filerActive = (type) => {
    if (type.toLowerCase() === "state") {
      if (active.stateDropDown === true) {
        setActive((prev) => ({
          ...prev,
          stateDropDown: false,
          categoryDropDown: false,
        }));
      } else {
        setActive((prev) => ({
          ...prev,
          stateDropDown: true,
          categoryDropDown: false,
        }));
      }
    } else if (type.toLowerCase() === "category") {
      if (active.categoryDropDown === true) {
        setActive((prev) => ({
          ...prev,
          stateDropDown: false,
          categoryDropDown: false,
        }));
      } else {
        setActive((prev) => ({
          ...prev,
          stateDropDown: false,
          categoryDropDown: true,
        }));
      }
    }
  };

  const searchOnClick = (e) => {
    let categoryFiler = document.getElementById("categoryFiler");
    e.target.innerText = "ALL SELECTIONS LOCKED";
    navigate(`/search-jobs/${textFieldInput.searchValue}`);
    window.document.title = `SWIPE 4 JOBS | Search | ${textFieldInput.searchValue}`;
    if (e.target.innerText === "ALL SELECTIONS LOCKED") {
      categoryFiler.style.pointerEvents = "none";
    }
  };

  const proceedOnClick = () => {
    if (Cookies.getItem("user-id") === user._id) {
      setIsPaymentProceeded(true);
    } else {
      navigate("/login");
    }
  };
  const checkoutOnClick = async () => {
    const stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );
    try {
      const stripe = await stripePromise;
      axios
        .post(
          `${HOST}/api/payment/buy/search/limit/search`,
          {
            qty: selectedLimitQty,
          },
          {
            headers: {
              "auth-token": Cookies.getItem("user-token"),
            },
          }
        )
        .then(async (response) => {
          await stripe.redirectToCheckout({
            sessionId: response.data.id,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };
  const limitButton = (type) => {
    if (type === "INCREMENT") {
      setSelectedLimitQty((selectedLimitQty += 1));
    } else if (type === "DECREMENT") {
      setSelectedLimitQty((selectedLimitQty -= 1));
    }
  };

  useEffect(() => {
    window.document.title = "SWIPE 4 JOBS | Search";
  }, []);

  useEffect(() => {
    if (selectedPosition.length <= 0) {
      setTextFieldInput((prev) => ({
        ...prev,
        category: "Select 1, 2, or 3 Careers",
      }));
    } else {
      setTextFieldInput((prev) => ({
        ...prev,
        category: selectedPosition.join(" / "),
      }));
    }
  }, [selectedPosition]);

  useEffect(() => {
    axios
      .post(
        `${HOST}/api/jobs/action/post/${
          textFieldInput.state.toLowerCase() === "select state"
            ? "florida"
            : textFieldInput.state
        }`,
        {
          position:
            selectedPosition.length <= 0 ? ["accounting"] : selectedPosition,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          setData((prev) => ({
            ...prev,
            success: true,
            error: false,
            data: res.data.data,
            loading: false,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedPosition, textFieldInput.state]);

  useEffect(() => {
    fetchUser().then((res) => {
      if (res.success === true) {
        setSearchLimit(res.user.search_limit);
        setUser(res.user);
      }
    });
  }, [fetchUser]);

  return (
    <>
      <div className="popup-alert" ref={alertPopup}>
        {!isPaymentProceeded && (
          <div className="card" ref={paymentCardRef}>
            <div className="header">
              <span className="icon">
                <RiIcons.RiSecurePaymentFill />
              </span>
              <p className="alert">Payment alert!</p>
            </div>

            <p className="message">
              You can choose up to 3 positions at no additional cost. If you
              wish to select more than 3, an upgrade with an additional payment
              will be required.
            </p>

            <div className="actions">
              <button onClick={proceedOnClick} className="read">
                Proceed
              </button>

              <button
                type="button"
                onClick={cancelButton}
                className="mark-as-read"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isPaymentProceeded && (
          <div className="card" ref={paymentCardRef}>
            <div className="header">
              <span className="icon">
                <RiIcons.RiSecurePaymentFill />
              </span>
              <p className="alert">Select Limit</p>
            </div>

            <p className="message">Select search limit:</p>
            <div className="payment-limit">
              <div className="limit-option">
                <button
                  onClick={() => limitButton("DECREMENT")}
                  disabled={selectedLimitQty <= 1}
                >
                  <FaIcons.FaMinus />
                </button>
                <input type="Number" value={selectedLimitQty} placeholder="0" />
                <button
                  disabled={selectedLimitQty >= category.length - 3}
                  onClick={() => limitButton("INCREMENT")}
                >
                  <FaIcons.FaPlus />
                </button>
              </div>
              <div className="price">
                ${(selectedLimitQty * 0.55).toFixed(2)}
              </div>
            </div>

            <div className="actions">
              <button onClick={checkoutOnClick} className="read">
                Checkout
              </button>

              <button
                type="button"
                onClick={cancelButton}
                className="mark-as-read"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <section className="searchHeader">
        <Header post={"POST"} />

        {/* For Mobile version  */}
        <div className="searchFormSection mobile">
          <form action="">
            <input type="text" disabled />
            <div
              style={
                active.stateDropDown
                  ? { color: "var(--primary-colour)", background: "#eaeffb" }
                  : { color: "#101010", background: "transparent" }
              }
              className="state dd"
              onClick={() => {
                filerActive("state");
              }}
            >
              {!textFieldInput.state ? "Select State" : textFieldInput.state}
              {active.stateDropDown ? (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronUpOutline />
                </span>
              ) : (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronDownOutline />
                </span>
              )}
            </div>
            <div
              onMouseLeave={() => {
                filerActive("state");
              }}
              style={
                active.stateDropDown
                  ? { transform: "scale(1)" }
                  : { transform: "scale(0)" }
              }
              className="lists stateList options"
            >
              <div className="first">
                {states.map((e, index) => {
                  return (
                    <ul
                      key={index}
                      style={{ listStyle: "none", display: "flex" }}
                    >
                      <li
                        className="item"
                        onClick={() => {
                          stateValue(e);
                        }}
                        style={
                          textFieldInput.state.toLowerCase() === e.toLowerCase()
                            ? {
                                background: "#ffffff",
                                color: "#101010",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                background: "transparent",
                                color: "#10101079",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                      >
                        {textFieldInput.state.toLowerCase() ===
                        e.toLowerCase() ? (
                          <div className="dot"></div>
                        ) : (
                          ""
                        )}
                        {e}
                      </li>
                    </ul>
                  );
                })}
              </div>
            </div>

            <div
              onClick={() => {
                filerActive("category");
              }}
              style={
                active.categoryDropDown
                  ? { color: "var(--primary-colour)", background: "#eaeffb" }
                  : { color: "#101010", background: "transparent" }
              }
              className="filter categoryFiler position dd"
              id="categoryFiler"
            >
              {textFieldInput.category.split("/").length > 3
                ? textFieldInput.category.split("/").splice(0, 3).join("/") +
                  ` + ${textFieldInput.category.split("/").length - 3}`
                : textFieldInput.category}
              {active.categoryDropDown ? (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronUpOutline />
                </span>
              ) : (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronDownOutline />
                </span>
              )}
            </div>
            <div
              onMouseLeave={() => {
                filerActive("category");
              }}
              style={
                active.categoryDropDown
                  ? { transform: "scale(1)" }
                  : { transform: "scale(0)" }
              }
              className="lists categoryList options"
            >
              <div className="first">
                {category.map((e, index) => {
                  return (
                    <ul
                      key={index}
                      style={{ listStyle: "none", display: "flex" }}
                    >
                      <li
                        onClick={() => {
                          categoryValue(e.toLocaleLowerCase());
                        }}
                        style={
                          selectedPosition.includes(e.toLowerCase())
                            ? {
                                background: "#ffffff",
                                color: "#101010",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                            : {
                                background: "transparent",
                                color: "#10101079",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }
                        }
                        className="item"
                      >
                        {selectedPosition.includes(e.toLowerCase()) ? (
                          <div className="dot"></div>
                        ) : (
                          ""
                        )}
                        {e}
                        {/* <span>{'0'}</span> */}
                      </li>
                    </ul>
                  );
                })}
              </div>
            </div>
            <button
              aria-label="search button"
              className="searchFormButton"
              onClick={searchOnClick}
            >
              <CiIcons.CiUnlock />
            </button>
          </form>
        </div>

        {/* For desktop version  */}
        <div className="searchFormSection desktop">
          <form action="" className="searchForm">
            <input
              className="searchFormInput"
              type="search"
              value={textFieldInput.searchValue}
              onChange={searchFieldChangeState}
              disabled={true}
            />
            <div
              style={
                active.stateDropDown
                  ? { color: "var(--primary-colour)", background: "#eaeffb" }
                  : { color: "#101010", background: "transparent" }
              }
              onClick={() => {
                filerActive("state");
              }}
              className="filter locationFiler"
            >
              <div className="placeHolder">{textFieldInput.state} </div>
              {active.stateDropDown ? (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronUpOutline />
                </span>
              ) : (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronDownOutline />
                </span>
              )}
            </div>

            <div
              onClick={() => {
                filerActive("category");
              }}
              style={
                active.categoryDropDown
                  ? { color: "var(--primary-colour)", background: "#eaeffb" }
                  : { color: "#101010", background: "transparent" }
              }
              className="filter categoryFiler"
              id="categoryFiler"
            >
              <div className="placeholder">
                {textFieldInput.category.split("/").length > 3
                  ? textFieldInput.category.split("/").splice(0, 3).join("/") +
                    ` + ${textFieldInput.category.split("/").length - 3}`
                  : textFieldInput.category}
              </div>

              {active.categoryDropDown ? (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronUpOutline />
                </span>
              ) : (
                <span className="dropDownIcon">
                  <Io5Icons.IoChevronDownOutline />
                </span>
              )}
            </div>
            <button
              aria-label="search button"
              className="searchFormButton"
              type="button"
              onClick={searchOnClick}
              disabled={
                selectedPosition.length <= 0 ||
                textFieldInput.state === "Select State"
              }
            >
              LOCK ALL SELECTIONS
            </button>

            {/* state list  */}
            <div
              onMouseLeave={() => {
                filerActive("state");
              }}
              style={
                active.stateDropDown
                  ? { transform: "scale(1)" }
                  : { transform: "scale(0)" }
              }
              className="lists stateList"
            >
              <div className="box">
                <ul className="row">
                  {states.slice(0, 14).map((e, index) => {
                    return (
                      <li
                        onClick={() => {
                          stateValue(e);
                        }}
                        style={
                          textFieldInput.state.toLowerCase() === e.toLowerCase()
                            ? {
                                background: "#ffffff",
                                color: "#101010",
                              }
                            : {
                                background: "transparent",
                                color: "#10101079",
                              }
                        }
                        key={index}
                      >
                        {textFieldInput.state.toLowerCase() ===
                        e.toLowerCase() ? (
                          <div className="dot"></div>
                        ) : (
                          ""
                        )}
                        {e}
                      </li>
                    );
                  })}
                </ul>
                <ul className="row">
                  {states.slice(14, 28).map((e, index) => {
                    return (
                      <li
                        onClick={() => {
                          stateValue(e);
                        }}
                        style={
                          textFieldInput.state.toLowerCase() === e.toLowerCase()
                            ? {
                                background: "#ffffff",
                                color: "#101010",
                              }
                            : {
                                background: "transparent",
                                color: "#10101079",
                              }
                        }
                        key={index}
                      >
                        {textFieldInput.state.toLowerCase() ===
                        e.toLowerCase() ? (
                          <div className="dot"></div>
                        ) : (
                          ""
                        )}
                        {e}
                      </li>
                    );
                  })}
                </ul>
                <ul className="row">
                  {states.slice(28, 42).map((e, index) => {
                    return (
                      <li
                        onClick={() => {
                          stateValue(e);
                        }}
                        style={
                          textFieldInput.state.toLowerCase() === e.toLowerCase()
                            ? {
                                background: "#ffffff",
                                color: "#101010",
                              }
                            : {
                                background: "transparent",
                                color: "#10101079",
                              }
                        }
                        key={index}
                      >
                        {textFieldInput.state.toLowerCase() ===
                        e.toLowerCase() ? (
                          <div className="dot"></div>
                        ) : (
                          ""
                        )}
                        {e}
                      </li>
                    );
                  })}
                </ul>
                <ul className="row">
                  {states.slice(42, states.length).map((e, index) => {
                    return (
                      <li
                        onClick={() => {
                          stateValue(e);
                        }}
                        style={
                          textFieldInput.state.toLowerCase() === e.toLowerCase()
                            ? {
                                background: "#ffffff",
                                color: "#101010",
                              }
                            : {
                                background: "transparent",
                                color: "#10101079",
                              }
                        }
                        key={index}
                      >
                        {textFieldInput.state.toLowerCase() ===
                        e.toLowerCase() ? (
                          <div className="dot"></div>
                        ) : (
                          ""
                        )}
                        {e}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {/* end of state list  */}

            {/* catrgory list section  */}
            <div
              onMouseLeave={() => {
                filerActive("category");
              }}
              style={
                active.categoryDropDown
                  ? { transform: "scale(1)" }
                  : { transform: "scale(0)" }
              }
              className="lists categoryList"
            >
              <div className="box">
                {Array.from(
                  { length: Math.ceil(category.length / 15) },
                  (_, i) => (
                    <ul className="row" key={i} style={{ width: "12rem" }}>
                      {category
                        .slice(i * 15, (i + 1) * 15)
                        .sort()
                        .map((e, index) => {
                          return (
                            <li
                              onClick={() => {
                                categoryValue(e.toLocaleLowerCase());
                              }}
                              style={
                                selectedPosition.includes(e.toLowerCase())
                                  ? {
                                      background: "#ffffff",
                                      color: "#101010",
                                    }
                                  : {
                                      background: "transparent",
                                      color: "#10101079",
                                    }
                              }
                              key={index}
                            >
                              {selectedPosition.includes(e.toLowerCase()) ? (
                                <div className="dot"></div>
                              ) : (
                                ""
                              )}
                              {e}
                              {/* <span>{'0'}</span> */}
                            </li>
                          );
                        })}
                    </ul>
                  )
                )}
              </div>
            </div>
            {/* End of category list  */}
          </form>
        </div>
      </section>

      {!data.error && !data.loading && data.data.length > 0 && data.success ? (
        <section className="searchContainer">
          <div
            style={{ margin: "0rem 2rem 2rem 0rem" }}
            className="postHeaderText"
          >
            SEARCH
          </div>
          <div className="searchContainerTitle">
            <div className="result">{data.data.length} Results</div>
          </div>
          <div className="defaultJobsContainer">
            {data.data.map((e) => {
              return (
                <div key={e._id} className="job-card">
                  <div className="image">
                    <img
                      src={`${HOST}/image/${e.logo.filename}`}
                      alt={e.name}
                    />
                  </div>
                  <div className="details-section">
                    <div className="first-details">
                      <h2 className="items-group ">{e.name}</h2>
                      <div className="tags items-group ">
                        <div className="tag-cont">
                          <span className="tag locTag">{e.state}</span>
                          <span className="tag catTag">{e.position[0]}</span>
                        </div>
                        <div className="type">
                          {e.schedule.map((e, ind) => {
                            return <h3 key={ind}>{e}</h3>;
                          })}
                        </div>
                      </div>
                      <div className="locationTag items-group ">
                        {e.city}&nbsp;
                        <div className="dot">
                          <GiIcons.GoDotFill />
                        </div>
                        &nbsp;{e.state}&nbsp;
                        <div className="dot">
                          <GiIcons.GoDotFill />
                        </div>
                        &nbsp;{e.zip}
                      </div>
                      <p className="items-group ">{e.overview}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        ""
      )}
      <section className="searchContainer">
        {/* If content is loading  */}
        {data.loading && (
          <>
            {" "}
            <div className="searchContainerTitle">
              <div className="result">Loading...</div>
            </div>
            <div className="loaderCard">
              {[0, 0, 0, 0].map((e, index) => {
                return (
                  <div key={index} className="cards-loader">
                    <div className="image-loader"></div>
                    <div className="others-loader">
                      <div className="headTitle-loader"></div>
                      <div className="tags-loader">
                        <span></span>
                        <span></span>
                      </div>
                      <div className="state-loader"></div>
                      <div className="paragraph-loader"></div>
                      <div className="paragraph-loader-two"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* If there is no contain  */}
        {!data.loading && data.success && data.data.length === 0 ? (
          <div className="searchNotFoundBox">
            <img src="/noSearchResult.png" alt="no search result found page" />
            <h3>No search result found</h3>
          </div>
        ) : (
          ""
        )}

        {!data.success && data.error ? (
          <div className="searchNotFoundBox">
            <img src="/serverError.png" alt="no search result found page" />
            <h3>Internal Server error</h3>
          </div>
        ) : (
          ""
        )}
      </section>
      <div style={{ height: "1rem" }} className="useless-field"></div>
    </>
  );
}
