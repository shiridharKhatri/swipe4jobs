import React, { useState } from "react";
import { Io5Icons } from "../assets/Icons/icons";
import axios from "axios";
import ButtonLoader from "./ButtonLoader";
import Cookies from "js-cookie";
export default function Postform(props) {
  const [selectedPosition, setSelectedPosition] = useState([]);
  const [selectSchedule, setSelectedSchedule] = useState([]);
  const host = import.meta.env.VITE_HOST;
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [val, setValue] = useState({
    name: !props.data ? "" : props.data.name,
    code: !props.data ? "" : props.data.code,
    state: !props.data ? "" : props.data.state,
    city: !props.data ? "" : props.data.city,
    zip: !props.data ? "" : props.data.zip,
    overview: !props.data ? "" : props.data.overview,
  });

  const [otherValue, setOtherVal] = useState({
    position: !props.data ? ["Select position"] : props.data.position,
    schedule: !props.data ? ["Select schedule"] : props.data.schedule,
    image: null,
  });
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
    if (id === "" || id.length <= 0) {
      let reqOptions = {
        url: `${host}/api/jobs/post-job/admin/${Cookies.get("id")}`,
        method: "POST",
        headers: { Accept: "*/*", "auth-token": Cookies.get("token") },
        data: bodyContent,
      };
      let respose = await axios.request(reqOptions);
      if (respose.status === 200) {
        if (respose.data.success === true) {
          setIsButtonLoading(false);
          window.location.reload();
        }
      } else {
        setIsButtonLoading(false);
      }
    } else if (id.length > 2 || id !== "") {
      let reqOptions = {
        url: `${host}/api/jobs/post-job/edit/${id}`,
        method: "PUT",
        headers: {
          "auth-token": Cookies.get("token"),
        },
        data: bodyContent,
      };
      let respose = await axios.request(reqOptions);
      if (respose.status === 200) {
        if (respose.data.success === true) {
          setIsButtonLoading(false);
          window.location.reload();
        }
      } else {
        setIsButtonLoading(false);
      }
    }
  };
  return (
    <div className="popupCard">
      <div className="form">
        <form className="card" action="">
          <div className="toptitle">
            <span className="postTitle">{props.title}</span>
            <span onClick={props.close} className="closeIcon">
              <Io5Icons.IoCloseSharp />
            </span>
          </div>
          <input
            onChange={valueOnChange}
            value={val.name}
            name="name"
            type="text"
            placeholder="Entity name"
          />
          <input
            onChange={valueOnChange}
            value={val.code}
            name="code"
            type="text"
            placeholder="Enter security code"
          />
          <input
            onChange={valueOnChange}
            value={val.state}
            name="state"
            type="text"
            placeholder="Enter state"
          />
          <input
            onChange={valueOnChange}
            value={val.city}
            name="city"
            type="text"
            placeholder="Enter city"
          />
          <input
            onChange={valueOnChange}
            value={val.zip}
            name="zip"
            type="text"
            placeholder="Enter zip code"
          />

          {/* Positions Dropdown */}
          <div className="select POSITIONS">
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
          </div>

          {/* Job Types Dropdown */}
          <div className="select job-type">
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
          <textarea
            onChange={valueOnChange}
            value={val.overview}
            name="overview"
            id="overview"
            placeholder="Enter overview"
          ></textarea>

          <div className="btns">
            <button onClick={props.close} type="button">
              CANCEL
            </button>
            <button
              onClick={() => jobPosting(!props.data ? "" : props.data._id)}
              type="button"
            >
              {isButtonLoading && <ButtonLoader />}
              {!isButtonLoading && (
                <>{props.type === "post" ? "POST" : "EDIT"} </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
