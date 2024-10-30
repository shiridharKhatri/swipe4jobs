import React, { useState } from "react";
import { Io5Icons } from "../assets/Icons/icons";
import ButtonLoader from "./ButtonLoader";
import { useRef } from "react";
export default function Postform({
  data,
  handelJobPosting,
  title,
  type,
  close,
}) {
  const [selectedPosition, setSelectedPosition] = useState([]);
  const [selectSchedule, setSelectedSchedule] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [val, setValue] = useState({
    name: !data ? "" : data.name,
    code: !data ? "" : data.code,
    state: !data ? "" : data.state,
    city: !data ? "" : data.city,
    zip: !data ? "" : data.zip,
    overview: !data ? "" : data.overview,
  });

  const [otherValue, setOtherVal] = useState({
    position: !data ? ["Select position"] : data.position,
    schedule: !data ? ["Select schedule"] : data.schedule,
    image: null,
  });

  const inpRef = useRef([]);
  const inpErrorRef = useRef([]);

  const POSITIONS = [
    "Accounting",
    "Actuary",
    "Ad",
    "Agriculture",
    "Architecture",
    "Artificial Intelligence",
    "Attorney",
    "Banking",
    "Beauty",
    "Biotechnology",
    "Blockchain",
    "Bookkeeping",
    "Call Center",
    "Computer Hardware",
    "Computer Software",
    "Construction",
    "Customer Service",
    "Data Entry",
    "Dentistry",
    "Driver",
    "Education",
    "Engineering",
    "Environment",
    "Fashion",
    "Fishing",
    "Forestry",
    "Food",
    "Restaurant",
    "Gems",
    "Jewelry",
    "Government",
    "Graphic Design",
    "Salon",
    "Spa",
    "Gym",
    "Health",
    "Human Resources",
    "Insurance",
    "Hospitality",
    "Math",
    "Science",
    "Mechanic",
    "Medical",
    "Nautical",
    "Non-Profit",
    "Paralegal",
    "PR",
    "Marketing",
    "Quality Control",
    "Real Estate",
    "Retail Cashier",
    "Retail Sales",
    "Robotics",
    "Security",
    "Sports",
    "Zoology",
    "Wildlife",
    "Gaming",
    "CyberSecurity",
    "Full Stack",
    "Website Apps",
    "Oil",
    "Gas",
    "Energy",
    "Waste",
    "Roll Off",
    "Surveying",
  ];
  const scheduleOnChange = (type) => {
    setSelectedSchedule((prev) => [...prev, type]);
  };
  const positionOnChange = (position) => {
    setSelectedPosition((prev) => [...prev, position]);
  };
  const TYPES = ["Full-time", "Part-time", "In-House", "Remote", "Contract"];
  const valueOnChange = (e) => {
    const { name, value } = e.target;
    setValue({ ...val, [name]: value });
  };

  const imageOnChange = (e) => {
    setOtherVal((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const jobPosting = async (id) => {
    let isValid = true;

    let formValidation = (value, inputRef, type) => {
      if (value === "") {
        inputRef.style.border = `.14rem solid #ff0000`;
        inputRef.style.background = `#ff000026`;
        isValid = false;
        return "Input field must not be empty";
      } else if ((type === "code" && value.length > 3) || value.length < 3) {
        inputRef.style.border = `.14rem solid #ff0000`;
        inputRef.style.background = `#ff000026`;
        isValid = false;
        return "Security code must be of 3 digit";
      } else {
        inputRef.style.border = `0.14rem solid #b1b1c5`;
        inputRef.style.background = `transparent`;
        return "";
      }
    };

    if (selectSchedule.length <= 0) {
      isValid = false;
      inpErrorRef.current.scheduleError.innerText =
        "Please select atleast one schedule";
    } else {
      inpErrorRef.current.scheduleError.innerText = "";
    }
    if (selectedPosition.length <= 0) {
      isValid = false;
      inpErrorRef.current.positionError.innerText =
        "Please select atleast one position";
    } else {
      inpErrorRef.current.positionError.innerText = "";
    }

    let name = formValidation(val.name, inpRef.current.name, "name");
    let code = formValidation(val.code, inpRef.current.code, "code");
    let state = formValidation(val.state, inpRef.current.state, "state");
    let city = formValidation(val.city, inpRef.current.city, "city");
    let zip = formValidation(val.zip, inpRef.current.zip, "zip");
    let overview = formValidation(
      val.overview,
      inpRef.current.overview,
      "overview"
    );

    inpErrorRef.current.nameError.innerText = name;
    inpErrorRef.current.codeError.innerText = code;
    inpErrorRef.current.stateError.innerText = state;
    inpErrorRef.current.cityError.innerText = city;
    inpErrorRef.current.zipError.innerText = zip;
    inpErrorRef.current.overviewError.innerText = overview;

    if (isValid) {
      setIsButtonLoading(true);
      let formdata = new FormData();
      formdata.append("name", val.name);
      selectSchedule.forEach((schedule) => {
        formdata.append("schedule[]", schedule);
      });
      formdata.append("state", val.state);
      formdata.append("code", val.code);
      formdata.append("city", val.city);
      formdata.append("zip", val.zip);
      formdata.append("overview", val.overview);
      selectedPosition.forEach((position) => {
        formdata.append("position[]", position);
      });
      formdata.append("logo", otherValue.image);
      let bodyContent = formdata;
      handelJobPosting(id, bodyContent).then((respose) => {
        if (respose.status === 200) {
          if (respose.data.success === true) {
            setIsButtonLoading(false);
            window.location.reload();
          }
        } else {
          setIsButtonLoading(false);
        }
      });
    }
  };
  return (
    <div className="popupCard">
      <div className="form">
        <form className="card" action="">
          <div className="toptitle">
            <span className="postTitle">{title}</span>
            <span onClick={close} className="closeIcon">
              <Io5Icons.IoCloseSharp />
            </span>
          </div>

          {["name", "code", "state", "city", "zip"].map((field, index) => {
            return (
              <div key={index} className="inp">
                <input
                  ref={(el) => (inpRef.current[field] = el)}
                  onChange={valueOnChange}
                  value={val[field]}
                  name={field}
                  type="text"
                  placeholder={`Enter ${field}`}
                />
                <p
                  ref={(el) => (inpErrorRef.current[`${field}Error`] = el)}
                  className="errorMessage"
                ></p>
              </div>
            );
          })}

          {/* Positions Dropdown */}
          <div className="select POSITIONS inp">
            <div
              className="selected"
              data-default="All Positions"
              data-one={POSITIONS[0]}
              data-two={POSITIONS[1]}
              data-three={POSITIONS[2]}
            >
              <span>
                {selectedPosition.length <= 0
                  ? otherValue.position.map((e, index) => {
                      return <span key={index}>{e}</span>;
                    })
                  : selectedPosition.map((e, index) => {
                      return <span key={index}>{e}</span>;
                    })}
              </span>
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
              {POSITIONS.map((position, index) => (
                <div key={index} title={position}>
                  <input
                    id={`position-${index}`}
                    name="position"
                    type="radio"
                    onChange={() => positionOnChange(position)}
                  />
                  <label
                    className="option"
                    htmlFor={`position-${index}`}
                    data-txt={position}
                  ></label>
                </div>
              ))}
            </div>
            <p
              ref={(el) => (inpErrorRef.current[`positionError`] = el)}
              className="errorMessage"
            ></p>
          </div>

          {/* Job Types Dropdown */}
          <div className="select job-type inp">
            <div
              className="selected"
              data-default="All Types"
              data-one={TYPES[0]}
              data-two={TYPES[1]}
              data-three={TYPES[2]}
            >
              <span>
                {selectSchedule.length <= 0
                  ? otherValue.schedule.map((e, index) => {
                      return <span key={index}>{e}</span>;
                    })
                  : selectSchedule.map((e, index) => {
                      return <span key={index}>{e}</span>;
                    })}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="arrow"
              >
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
              </svg>
            </div>
            <div className="options" style={{ height: "15rem" }}>
              {TYPES.map((type, index) => (
                <div key={index} title={type}>
                  <input
                    id={`type-${index}`}
                    name="type"
                    type="radio"
                    onChange={() => scheduleOnChange(type)}
                  />
                  <label
                    className="option"
                    htmlFor={`type-${index}`}
                    data-txt={type}
                  ></label>
                </div>
              ))}
            </div>
            <p
              ref={(el) => (inpErrorRef.current[`scheduleError`] = el)}
              className="errorMessage"
            ></p>
          </div>
          <div className="fileUpload">
            <input type="file" id="file" hidden onChange={imageOnChange} />
            <label htmlFor="file">
              <button type="button">Choose logo</button>
              <span>
                {!otherValue.image ? "No logo choosen" : otherValue.image.name}
              </span>
            </label>
          </div>

          <div className="textarea inp">
            <textarea
              ref={(el) => (inpRef.current["overview"] = el)}
              onChange={valueOnChange}
              value={val.overview}
              name="overview"
              id="overview"
              placeholder="Enter overview"
            ></textarea>
            <p
              ref={(el) => (inpErrorRef.current[`overviewError`] = el)}
              className="errorMessage"
            ></p>
          </div>

          <div className="btns">
            <button onClick={close} type="button">
              CANCEL
            </button>
            <button
              onClick={() => jobPosting(!data ? "" : data._id)}
              type="button"
            >
              {isButtonLoading && <ButtonLoader />}
              {!isButtonLoading && <>{type === "post" ? "POST" : "EDIT"} </>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
